from app.core.llm import get_llm
from app.models.db import Contract
from sqlalchemy.orm import Session
from langchain_core.messages import HumanMessage
import json

class CompareService:
    def __init__(self):
        self.llm = get_llm(temperature=0.0)

    async def compare_contracts(self, contract1_id: int, contract2_id: int, db: Session) -> dict:
        from sqlalchemy.orm import selectinload
        
        # Eager load clauses to ensure factual grounding
        c1 = db.query(Contract).options(selectinload(Contract.clauses)).filter(Contract.id == contract1_id).first()
        c2 = db.query(Contract).options(selectinload(Contract.clauses)).filter(Contract.id == contract2_id).first()
        
        if not c1 or not c2:
            raise ValueError("One or both contracts not found")

        # Helper to format clauses for context
        def format_contract_data(contract):
            clauses_str = "\n".join([f"- {c.category}: {c.text}" for c in contract.clauses]) if contract.clauses else "No detailed clauses extracted."
            return f"""
            Filename: {contract.filename}
            EXTRACTED CLAUSES:
            {clauses_str}
            """

        context = f"""
        CONTRACT A (Baseline):
        {format_contract_data(c1)}
        
        CONTRACT B (Comparison):
        {format_contract_data(c2)}
        """

        prompt = f"""
        Enhance the contract comparison and executive summary workflows to enforce strict factual grounding.

        Apply the following rules:

        All comparative analysis must reference only clauses explicitly extracted from each contract.

        If a clause does not exist in a document, explicitly state “Not specified in the contract.”

        Do not infer payment structures, fees, penalties, or conditions unless they are present in the source text.

        Liability assessments must reflect whether a liability cap exists and include the exact cap value when available.

        Executive summaries must be generated from structured extracted data, not free text reasoning.

        Any recommendation must reference concrete clause differences rather than hypothetical risks.

        The system must prefer saying “information not available” over speculative reasoning.

        GOAL: Compare Contract A and Contract B based strictly on the provided EXTRACTED CLAUSES.

        {context}
        
        Return a JSON response with the following structure:
        {{
            "overview_diff": "A short paragraph explaining the main factual differences founded in the text.",
            "key_differences": [
                {{
                    "category": "Liability/Payment/Termination/etc",
                    "contract_a_point": "Exact term from A or 'Not specified'",
                    "contract_b_point": "Exact term from B or 'Not specified'",
                    "assessment": "Factual comparison of the two terms."
                }}
            ],
            "recommendation": "Recommendation based ONLY on the extracted facts."
        }}
        """
        
        try:
            response = await self.llm.ainvoke([HumanMessage(content=prompt)])
            content = response.content.strip()
            
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]
                
            return json.loads(content)
        except Exception as e:
            return {
                "overview_diff": "Error processing comparison.",
                "key_differences": [],
                "recommendation": str(e)
            }

compare_service = CompareService()
