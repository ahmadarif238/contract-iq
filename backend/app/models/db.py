from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum as SqEnum, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.database import Base

class RiskLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ContractStatus(str, enum.Enum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    ANALYZED = "analyzed"
    FAILED = "failed"

class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    upload_date = Column(DateTime, default=datetime.utcnow)
    status = Column(SqEnum(ContractStatus), default=ContractStatus.UPLOADED)
    summary = Column(Text, nullable=True)
    metadata_json = Column(JSON, nullable=True)

    # Lifecycle Intelligence
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    renewal_terms = Column(Text, nullable=True)
    notice_period_days = Column(Integer, nullable=True)

    clauses = relationship("Clause", back_populates="contract", cascade="all, delete-orphan")
    risks = relationship("Risk", back_populates="contract", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="contract", cascade="all, delete-orphan")

class Clause(Base):
    __tablename__ = "clauses"

    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.id"))
    category = Column(String, index=True) # e.g., "Termination", "Payment"
    text = Column(Text)
    page_number = Column(Integer, nullable=True)
    
    contract = relationship("Contract", back_populates="clauses")

class Risk(Base):
    __tablename__ = "risks"

    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.id"))
    clause_id = Column(Integer, ForeignKey("clauses.id"), nullable=True)
    description = Column(Text)
    risk_level = Column(SqEnum(RiskLevel))
    recommendation = Column(Text, nullable=True)

    contract = relationship("Contract", back_populates="risks")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.id"))
    alert_type = Column(String) # e.g., "Renewal", "Termination Deadline"
    due_date = Column(DateTime)
    status = Column(String, default="pending") # pending, sent, resolved
    
    contract = relationship("Contract", back_populates="alerts")
