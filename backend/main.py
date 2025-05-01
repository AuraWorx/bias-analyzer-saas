from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import json
import pandas as pd
import os
import uuid
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext

from database import get_db, engine
import models
import schemas

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="BiasAnalyzer API", description="API for bias analysis in data")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
SECRET_KEY = "your-secret-key"  # In production, use environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except jwt.PyJWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == token_data.username).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_active_user(current_user: models.User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# Authentication endpoints
@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# User endpoints
@app.post("/api/auth/signup", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create tenant
    tenant = models.Tenant(
        name=user.company_name,
        domain=user.email.split("@")[1] if "@" in user.email else None
    )
    db.add(tenant)
    db.flush()
    
    # Create user
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password,
        tenant_id=tenant.id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Generate token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    
    return {
        "id": db_user.id,
        "email": db_user.email,
        "name": db_user.name,
        "tenant_id": db_user.tenant_id,
        "access_token": access_token,
        "token_type": "bearer"
    }

@app.post("/api/auth/login", response_model=schemas.UserResponse)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    if not db_user or not verify_password(user_credentials.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    
    return {
        "id": db_user.id,
        "email": db_user.email,
        "name": db_user.name,
        "tenant_id": db_user.tenant_id,
        "access_token": access_token,
        "token_type": "bearer"
    }

@app.get("/api/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_active_user)):
    return current_user

# File upload endpoints
@app.post("/api/uploads", response_model=schemas.UploadResponse)
async def upload_file(
    file: UploadFile = File(None),
    url: str = Form(None),
    json_data: str = Form(None),
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if not file and not url and not json_data:
        raise HTTPException(status_code=400, detail="No data provided")
    
    # Generate a unique filename
    filename = f"{uuid.uuid4()}"
    file_path = f"uploads/{filename}"
    
    # Create uploads directory if it doesn't exist
    os.makedirs("uploads", exist_ok=True)
    
    # Process the data based on the input type
    if file:
        filename = file.filename
        file_type = filename.split(".")[-1].lower()
        
        # Save the file
        with open(file_path, "wb") as f:
            f.write(await file.read())
    
    elif url:
        # In a real app, you would download the file from the URL
        filename = url.split("/")[-1]
        file_type = filename.split(".")[-1].lower()
        
        # Placeholder for URL download
        with open(file_path, "w") as f:
            f.write(f"Downloaded from {url}")
    
    elif json_data:
        filename = f"data_{uuid.uuid4()}.json"
        file_type = "json"
        
        # Save the JSON data
        with open(file_path, "w") as f:
            f.write(json_data)
    
    # Create upload record in database
    upload = models.Upload(
        filename=filename,
        file_type=file_type,
        file_path=file_path,
        user_id=current_user.id,
        tenant_id=current_user.tenant_id,
        status="Uploaded"
    )
    db.add(upload)
    db.commit()
    db.refresh(upload)
    
    # Trigger analysis (in a real app, this would be a background task)
    analyze_file(upload.id, db)
    
    return {
        "id": upload.id,
        "filename": upload.filename,
        "file_type": upload.file_type,
        "status": upload.status,
        "created_at": upload.created_at
    }

@app.get("/api/uploads", response_model=List[schemas.Upload])
def get_uploads(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    uploads = db.query(models.Upload).filter(
        models.Upload.tenant_id == current_user.tenant_id
    ).order_by(models.Upload.created_at.desc()).all()
    
    return uploads

# Analysis endpoints
def analyze_file(upload_id: int, db: Session):
    """
    Analyze the uploaded file for bias.
    In a real app, this would be a more complex analysis.
    """
    upload = db.query(models.Upload).filter(models.Upload.id == upload_id).first()
    if not upload:
        return
    
    # Update status to processing
    upload.status = "Processing"
    db.commit()
    
    try:
        # Simulate analysis
        # In a real app, this would be a more complex analysis
        analysis_results = {
            "bias_detected": True,
            "bias_types": ["gender", "age"],
            "confidence": 0.85,
            "details": {
                "gender_bias_score": 0.72,
                "age_bias_score": 0.65,
                "ethnicity_bias_score": 0.32
            }
        }
        
        # Create analysis record
        analysis = models.Analysis(
            upload_id=upload.id,
            user_id=upload.user_id,
            tenant_id=upload.tenant_id,
            results=json.dumps(analysis_results),
            status="Completed"
        )
        db.add(analysis)
        
        # Update upload status
        upload.status = "Analyzed"
        db.commit()
        db.refresh(analysis)
        
        # Generate report
        generate_report(analysis.id, db)
        
    except Exception as e:
        upload.status = "Failed"
        db.commit()
        print(f"Analysis failed: {str(e)}")

@app.get("/api/analyses", response_model=List[schemas.Analysis])
def get_analyses(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    analyses = db.query(models.Analysis).filter(
        models.Analysis.tenant_id == current_user.tenant_id
    ).order_by(models.Analysis.created_at.desc()).all()
    
    return analyses

@app.get("/api/analyses/{analysis_id}", response_model=schemas.Analysis)
def get_analysis(
    analysis_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    analysis = db.query(models.Analysis).filter(
        models.Analysis.id == analysis_id,
        models.Analysis.tenant_id == current_user.tenant_id
    ).first()
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return analysis

# Report endpoints
def generate_report(analysis_id: int, db: Session):
    """
    Generate a report from the analysis.
    In a real app, this would create a PDF or other document.
    """
    analysis = db.query(models.Analysis).filter(models.Analysis.id == analysis_id).first()
    if not analysis:
        return
    
    try:
        # Simulate report generation
        report_data = {
            "title": f"Bias Analysis Report #{analysis_id}",
            "summary": "This report summarizes the bias analysis findings.",
            "findings": json.loads(analysis.results),
            "recommendations": [
                "Review hiring practices to address gender bias",
                "Implement age-neutral language in communications",
                "Conduct regular bias training for employees"
            ]
        }
        
        # Create report record
        report = models.Report(
            analysis_id=analysis.id,
            user_id=analysis.user_id,
            tenant_id=analysis.tenant_id,
            content=json.dumps(report_data),
            status="Generated"
        )
        db.add(report)
        db.commit()
        
    except Exception as e:
        print(f"Report generation failed: {str(e)}")

@app.get("/api/reports", response_model=List[schemas.Report])
def get_reports(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    reports = db.query(models.Report).filter(
        models.Report.tenant_id == current_user.tenant_id
    ).order_by(models.Report.created_at.desc()).all()
    
    return reports

@app.get("/api/reports/{report_id}", response_model=schemas.Report)
def get_report(
    report_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    report = db.query(models.Report).filter(
        models.Report.id == report_id,
        models.Report.tenant_id == current_user.tenant_id
    ).first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return report

# Dashboard endpoints
@app.get("/api/dashboard/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Get counts
    upload_count = db.query(models.Upload).filter(
        models.Upload.tenant_id == current_user.tenant_id
    ).count()
    
    analysis_count = db.query(models.Analysis).filter(
        models.Analysis.tenant_id == current_user.tenant_id
    ).count()
    
    report_count = db.query(models.Report).filter(
        models.Report.tenant_id == current_user.tenant_id
    ).count()
    
    # Get recent uploads
    recent_uploads = db.query(models.Upload).filter(
        models.Upload.tenant_id == current_user.tenant_id
    ).order_by(models.Upload.created_at.desc()).limit(5).all()
    
    # Get recent analyses
    recent_analyses = db.query(models.Analysis).filter(
        models.Analysis.tenant_id == current_user.tenant_id
    ).order_by(models.Analysis.created_at.desc()).limit(5).all()
    
    return {
        "upload_count": upload_count,
        "analysis_count": analysis_count,
        "report_count": report_count,
        "recent_uploads": recent_uploads,
        "recent_analyses": recent_analyses
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
