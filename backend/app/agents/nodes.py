import json
from langchain_core.messages import SystemMessage, HumanMessage
from app.core.llm import get_llm
from app.agents.state import AgentState
from app.services.rag import rag_service

llm = get_llm(temperature=0.1)

async def clause_extraction_node(state: AgentState):
    """
    Agent to extract critical clauses from the contract.
    """
    contract_id = state["contract_id"]
    # In a real scenario, we might iterate over chunks or use RAG to find specific sections.
    # For this system, let's assume we query for specific clause types.
    
    clause_types = ["Termination", "Confidentiality", "Liability", "Payment Terms", "Renewal"]
    extracted_clauses = []
    
    for c_type in clause_types:
        # Retrieve relevant chunks for this clause type
        docs = rag_service.retrieve(f"{c_type} clause", k=3, filter={"contract_id": contract_id})
        context = rag_service.format_docs(docs)
        
        prompt = f"""
        You are a legal expert. Extract the '{c_type}' clause from the following context. 
        If present, provide the exact text and a brief summary.
        If not present, return null.
        
        Context:
        {context}
        
        Return JSON format: {{ "category": "{c_type}", "text": "...", "summary": "..." }}
        """
        
        response = llm.invoke([HumanMessage(content=prompt)])
        content = response.content.strip()
        
        # Basic parsing (in prod, use structured output or PydanticOutputParser)
        try:
            # removing code blocks if any
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]
            
            data = json.loads(content)
            if data:
                extracted_clauses.append(data)
        except:
            # Fallback or log error
            pass
            
    return {"extracted_clauses": extracted_clauses}

async def risk_analysis_node(state: AgentState):
    """
    Agent to analyze risks in extracted clauses.
    """
    clauses = state.get("extracted_clauses", [])
    risks = []
    
    for clause in clauses:
        prompt = f"""
        Analyze the risk level of the following '{clause['category']}' clause.
        
        Clause Text: "{clause.get('text', '')}"
        
        Rules:
        - High Risk: Unlimited liability, auto-renewal without notice, non-compete > 2 years.
        - Medium Risk: Vague termination usage, payment > 60 days.
        - Low Risk: Standard terms.
        
        Return JSON: {{ "risk_level": "High|Medium|Low", "reasoning": "...", "recommendation": "..." }}
        """
        
        response = llm.invoke([HumanMessage(content=prompt)])
        content = response.content.strip()
        
        try:
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]
                
            data = json.loads(content)
            if data:
                data["clause_category"] = clause["category"]
                risks.append(data)
        except:
            pass
            
    return {"risks": risks}

async def summarize_node(state: AgentState):
    """
    Agent to provide an executive summary.
    """
    # We might pull a summary from the metadata or generate one from the first few chunks
    # For now, let's just ask the LLM to summarize the risks and clauses found.
    
    # Serialize extracted clauses and risks into context for the LLM
    clauses = state.get("extracted_clauses", [])
    risks = state.get("risks", [])
    
    clauses_text = "\n".join([f"- {c['category']}: {c.get('text', 'Not found')}" for c in clauses])
    risks_text = "\n".join([f"- {r.get('clause_category')}: {r.get('risk_level')} Risk. {r.get('reasoning')}" for r in risks])
    
    context_str = f"""
    EXTRACTED CLAUSES:
    {clauses_text}
    
    IDENTIFIED RISKS:
    {risks_text}
    """
    
    prompt = f"""
    You are a professional legal analyst. Provide a factual, risk-focused executive summary of the contract analysis.
    
    STRICT RULES:
    1. All analysis must be based ONLY on the EXTRACTED CLAUSES provided above.
    2. If a clause or term is not listed in "EXTRACTED CLAUSES", do NOT invent it.
    3. Do NOT infer payment terms, liability caps, or specific values unless they are explicitly present in the text.
    4. If information is missing, state "Information not available in extracted sections".
    
    Structure:
    1. **Overview**: Brief description based on available text.
    2. **Critical Risks**: Highlight only HIGH and CRITICAL risks found.
    3. **Key Findings**: Summarize the Termination, Liability, and Payment terms if found.
    4. **Recommendations**: Actionable steps based on the identified risks.
    
    Context:
    {context_str}
    """
    
    response = await llm.ainvoke([HumanMessage(content=prompt)])
    return {"summary": response.content}

async def lifecycle_node(state: AgentState):
    """
    Agent to extract contract lifecycle dates and terms.
    """
    contract_id = state["contract_id"]
    
    # Retrieve snippets related to dates and term
    docs = rag_service.retrieve("effective date start date expiration term renewal notice period", k=5, filter={"contract_id": contract_id})
    context = rag_service.format_docs(docs)
    
    prompt = f"""
    Extract the following lifecycle information from the contract context:
    1. Start Date (Effective Date) - Format: YYYY-MM-DD or null
    2. End Date (Expiration Date) - Format: YYYY-MM-DD or null
    3. Renewal Terms - Brief summary of renewal conditions (e.g., "Auto-renews for 1 year") or null
    4. Notice Period - Days required for termination/non-renewal (integer) or null
    
    Context:
    {context}
    
    Return JSON format:
    {{
        "start_date": "YYYY-MM-DD",
        "end_date": "YYYY-MM-DD",
        "renewal_terms": "...",
        "notice_period_days": 30
    }}
    """
    
    lifecycle_data = {}
    try:
        response = llm.invoke([HumanMessage(content=prompt)])
        content = response.content.strip()
        
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
            
        lifecycle_data = json.loads(content)
        lifecycle_data = json.loads(content)
        # print(f"DEBUG: Extracted Lifecycle Data: {lifecycle_data}")
    except Exception as e:
        print(f"Lifecycle extraction error: {e}")
        
    return {"lifecycle": lifecycle_data}
