from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    domain = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    users = relationship("User", back_populates="tenant")
    uploads = relationship("Upload", back_populates="tenant")
    analyses = relationship("Analysis", back_populates="tenant")
    reports = relationship("Report", back_populates="tenant")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    tenant = relationship("Tenant", back_populates="users")
    uploads = relationship("Upload", back_populates="user")
    analyses = relationship("Analysis", back_populates="user")
    reports = relationship("Report", back_populates="user")

class Upload(Base):
    __tablename__ = "uploads"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    status = Column(String, default="Uploaded")
    user_id = Column(Integer, ForeignKey("users.id"))
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="uploads")
    tenant = relationship("Tenant", back_populates="uploads")
    analyses = relationship("Analysis", back_populates="upload")

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    upload_id = Column(Integer, ForeignKey("uploads.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    results = Column(Text, nullable=True)
    status = Column(String, default="Pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    upload = relationship("Upload", back_populates="analyses")
    user = relationship("User", back_populates="analyses")
    tenant = relationship("Tenant", back_populates="analyses")
    reports = relationship("Report", back_populates="analysis")

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    content = Column(Text, nullable=True)
    status = Column(String, default="Pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    analysis = relationship("Analysis", back_populates="reports")
    user = relationship("User", back_populates="reports")
    tenant = relationship("Tenant", back_populates="reports")
