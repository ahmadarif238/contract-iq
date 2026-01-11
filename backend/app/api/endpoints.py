from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.ingestion import ingestion_service
from app.services.qa_service import qa_service
from app.services.compare_service import compare_service
from app.agents.graph import app_graph
from app.models.db import Contract, ContractStatus, Alert, Clause, Risk, RiskLevel
import shutil
import os
from datetime import datetime, timedelta
from pydantic import BaseModel

class AskRequest(BaseModel):
    question: str

class CompareRequest(BaseModel):
    contract_id_1: int
    contract_id_2: int

router = APIRouter()

@router.post("/compare")
async def compare_contracts(request: CompareRequest, db: Session = Depends(get_db)):
    return await compare_service.compare_contracts(request.contract_id_1, request.contract_id_2, db)

@router.post("/ask/global")
async def ask_global(request: AskRequest):
    return await qa_service.ask_question(question=request.question, contract_id=None)

@router.post("/ask/{contract_id}")
async def ask_contract_question(
    contract_id: int, 
    request: AskRequest, 
    db: Session = Depends(get_db)
):
    # Check if contract exists
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
        
    response = await qa_service.ask_question(question=request.question, contract_id=contract_id)
    return response

@router.post("/upload")
async def upload_contract(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    # Save file locally
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
        
    # Create DB entry
    db_contract = Contract(filename=file.filename, status=ContractStatus.PROCESSING)
    db.add(db_contract)
    db.commit()
    db.refresh(db_contract)
    
    # Trigger processing in background automatically
    background_tasks.add_task(run_analysis_pipeline, db_contract.id, file_location, db)
    
    return {"id": db_contract.id, "status": "processing"}

@router.post("/analyze/{contract_id}")
async def analyze_contract(contract_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
        
    # Ingest if not done? Assuming upload triggers ingestion or we do it here.
    # Let's do ingestion + analysis here for simplicity of the "Analyze" button.
    # But usually upload -> ingest.
    
    # Assuming file is saved at temp_{filename}
    file_path = f"temp_{contract.filename}"
    if not os.path.exists(file_path):
         raise HTTPException(status_code=400, detail="File not found on server")

    background_tasks.add_task(run_analysis_pipeline, contract_id, file_path, db)
    
    return {"message": "Analysis started"}

async def run_analysis_pipeline(contract_id: int, file_path: str, db: Session):
    # 1. Ingest
    try:
        await ingestion_service.ingest_file(file_path, contract_id)
        
        # 2. Run Agents
        initial_state = {"contract_id": contract_id, "extracted_clauses": [], "risks": []}
        result = await app_graph.ainvoke(initial_state)
        
        # 3. Update DB
        contract = db.query(Contract).filter(Contract.id == contract_id).first()
        contract.summary = result.get("summary")
        contract.status = ContractStatus.ANALYZED
        contract.metadata_json = result # Store full result json
        
        # CLEAR OLD DATA (for re-runs)
        db.query(Clause).filter(Clause.contract_id == contract_id).delete()
        db.query(Risk).filter(Risk.contract_id == contract_id).delete()
        db.commit() # Commit delete first
        
        # POPULATE CLAUSES
        extracted_clauses = result.get("extracted_clauses", [])
        for c_data in extracted_clauses:
            clause = Clause(
                contract_id=contract_id,
                category=c_data.get("category"),
                text=c_data.get("text", "")
            )
            db.add(clause)
            
        # POPULATE RISKS
        risks_data = result.get("risks", [])
        for r_data in risks_data:
            # Map risk level string to Enum if needed, or rely on string compatibility
            level_str = r_data.get("risk_level", "low").lower()
            if level_str == "high": level = RiskLevel.HIGH
            elif level_str == "medium": level = RiskLevel.MEDIUM
            elif level_str == "critical": level = RiskLevel.CRITICAL
            else: level = RiskLevel.LOW
            
            risk = Risk(
                contract_id=contract_id,
                clause_id=None, # We'd need complex mapping to link exact clause ID here
                description=r_data.get("reasoning", ""), # Using reasoning as description
                risk_level=level,
                recommendation=r_data.get("recommendation", "")
            )
            db.add(risk)
        
        # Save lifecycle info
        lifecycle = result.get("lifecycle", {})
        if lifecycle:
            # Parse dates safely
            from datetime import datetime
            
            def parse_date(date_str):
                if not date_str: return None
                try:
                    return datetime.strptime(date_str, "%Y-%m-%d")
                except:
                    return None

            contract.start_date = parse_date(lifecycle.get("start_date"))
            contract.end_date = parse_date(lifecycle.get("end_date"))
            contract.renewal_terms = lifecycle.get("renewal_terms")
            
            # Safe int casting
            import re
            npCallback = lifecycle.get("notice_period_days")
            if npCallback:
                if isinstance(npCallback, int):
                    contract.notice_period_days = npCallback
                elif isinstance(npCallback, str):
                    # Try to find digits
                    ints = re.findall(r'\d+', npCallback)
                    if ints:
                        contract.notice_period_days = int(ints[0])

            # Generate Alerts
            if contract.end_date:
                # Expiration Alert
                alert_exp = Alert(
                    contract_id=contract.id,
                    alert_type="Contract Expiration",
                    due_date=contract.end_date,
                    status="pending"
                )
                db.add(alert_exp)

                # Notice Period Alert
                if contract.notice_period_days:
                     notice_date = contract.end_date - timedelta(days=contract.notice_period_days)
                     alert_notice = Alert(
                        contract_id=contract.id,
                        alert_type="Termination Notice Deadline",
                        due_date=notice_date,
                        status="pending"
                     )
                     db.add(alert_notice)

        db.commit()
        
    except Exception as e:
        print(f"Error: {e}")
        contract = db.query(Contract).filter(Contract.id == contract_id).first()
        contract.status = ContractStatus.FAILED
        db.commit()

@router.get("/contracts")
def get_contracts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Contract).offset(skip).limit(limit).all()

@router.get("/contracts/{contract_id}")
@router.get("/contracts/{contract_id}")
def get_contract(contract_id: int, db: Session = Depends(get_db)):
    from sqlalchemy.orm import selectinload
    return db.query(Contract).filter(Contract.id == contract_id)\
        .options(selectinload(Contract.alerts))\
        .options(selectinload(Contract.risks))\
        .options(selectinload(Contract.clauses))\
        .first()

@router.delete("/contracts/{contract_id}")
async def delete_contract(contract_id: int, db: Session = Depends(get_db)):
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
        
    # Delete local file if exists
    try:
        file_path = f"temp_{contract.filename}"
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        print(f"Error deleting file: {e}")

    # Delete from DB (cascades to related tables)
    db.delete(contract)
    db.commit()
    
    return {"message": "Contract deleted successfully"}

class RewriteRequest(BaseModel):
    clause_text: str
    instruction: str

@router.post("/rewrite")
async def rewrite_clause(request: RewriteRequest):
    return await qa_service.rewrite_clause(request.clause_text, request.instruction)

@router.get("/analytics/stats")
def get_analytics(db: Session = Depends(get_db)):
    contracts = db.query(Contract).all()
    
    total = len(contracts)
    analyzed = sum(1 for c in contracts if c.status == ContractStatus.ANALYZED)
    
    # Aggregating risks (requires deeper query or loop)
    high_risks = 0
    for c in contracts:
        high_risks += sum(1 for r in c.risks if r.risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL])
    
    # Expiring soon (30 days)
    expiring_soon = 0
    now = datetime.utcnow()
    limit = now + timedelta(days=30)
    for c in contracts:
        if c.end_date and now < c.end_date <= limit:
            expiring_soon += 1
            
    return {
        "total_contracts": total,
        "analyzed_contracts": analyzed,
        "high_risks": high_risks,
        "expiring_soon": expiring_soon
    }
