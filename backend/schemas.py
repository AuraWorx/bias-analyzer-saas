from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str
    company_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    tenant_id: int
    is_active: bool = True
    created_at: datetime
    
    class Config:
        orm_mode = True

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    tenant_id: int
    access_token: str
    token_type: str

# Tenant schemas
class TenantBase(BaseModel):
    name: str
    domain: Optional[str] = None

class TenantCreate(TenantBase):
    pass

class Tenant(TenantBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        orm_mode = True

# Upload schemas
class UploadBase(BaseModel):
    filename: str
    file_type: str
    status: str

class UploadCreate(UploadBase):
    file_path: str
    user_id: int
    tenant_id: int

class Upload(UploadBase):
    id: int
    user_id: int
    tenant_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class UploadResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    status: str
    created_at: datetime

# Analysis schemas
class AnalysisBase(BaseModel):
    upload_id: int
    status: str

class AnalysisCreate(AnalysisBase):
    user_id: int
    tenant_id: int
    results: Optional[str] = None

class Analysis(AnalysisBase):
    id: int
    user_id: int
    tenant_id: int
    results: Optional[str] = None
    created_at: datetime
    
    class Config:
        orm_mode = True

# Report schemas
class ReportBase(BaseModel):
    analysis_id: int
    status: str

class ReportCreate(ReportBase):
    user_id: int
    tenant_id: int
    content: Optional[str] = None

class Report(ReportBase):
    id: int
    user_id: int
    tenant_id: int
    content: Optional[str] = None
    created_at: datetime
    
    class Config:
        orm_mode = True

# Dashboard schemas
class DashboardStats(BaseModel):
    upload_count: int
    analysis_count: int
    report_count: int
    recent_uploads: List[Upload]
    recent_analyses: List[Analysis]
    
    class Config:
        orm_mode = True
