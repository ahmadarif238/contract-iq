from typing import TypedDict, List, Dict, Any, Optional
from langchain_core.messages import BaseMessage

class AgentState(TypedDict):
    contract_id: int
    contract_text: Optional[str] # Full text or summary if needed, but usually we work with chunks
    # We might pass the contract_id around and let agents fetch what they need or use RAG
    
    messages: List[BaseMessage] # Chat history
    
    extracted_clauses: List[Dict[str, Any]] # List of extracted clauses with metadata
    risks: List[Dict[str, Any]] # List of identified risks
    
    summary: Optional[str] # Executive summary
    lifecycle: Optional[Dict[str, Any]] # Extracted dates and terms
    
    # Flags for workflow control
    is_analyzed: bool
    current_step: str
