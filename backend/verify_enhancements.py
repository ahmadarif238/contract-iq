import asyncio
import os
import sys

# Ensure backend folder is in python path
sys.path.append(os.getcwd())

from app.services.qa_service import qa_service
from app.agents.nodes import lifecycle_node
from app.agents.state import AgentState

# Mocking RAG for deterministic testing without full DB
from unittest.mock import MagicMock
from app.services.rag import rag_service

# Mock retrieve to return sample contract text
rag_service.retrieve = MagicMock(return_value=[
    MagicMock(page_content="This Agreement shall commence on 2024-01-01 (the 'Effective Date') and shall continue for a period of two (2) years ending on 2026-01-01. Notice of termination must be provided at least 30 days prior to renewal.", metadata={"source": "test.pdf"}),
    MagicMock(page_content="The limit of liability shall not exceed $1,000,000.", metadata={"source": "test.pdf"})
])

rag_service.format_docs = MagicMock(return_value="""
Source: test.pdf
Content: This Agreement shall commence on 2024-01-01 (the 'Effective Date') and shall continue for a period of two (2) years ending on 2026-01-01. Notice of termination must be provided at least 30 days prior to renewal.
Source: test.pdf
Content: The limit of liability shall not exceed $1,000,000.
""")

async def test_qa():
    print("--- Testing /ask Endpoint Logic ---")
    question = "What is the notice period?"
    print(f"Question: {question}")
    
    # We are calling the real LLM here, assuming API Key is set
    try:
        response = await qa_service.ask_question(contract_id=1, question=question)
        print("Response:", response)
        
        if "answer" in response and "citations" in response:
            print("✅ Structure Valid")
        else:
            print("❌ Structure Invalid")
            
        if response.get("citations"):
            print("✅ Citations present")
        else:
            print("⚠️ No citations found (might be expected depending on model)")
            
    except Exception as e:
        print(f"❌ Error: {e}")

async def test_lifecycle():
    print("\n--- Testing Lifecycle Extraction ---")
    state = {"contract_id": 1, "extracted_clauses": [], "risks": []}
    
    try:
        result = await lifecycle_node(state)
        print("Result:", result)
        
        lifecycle = result.get("lifecycle", {})
        if lifecycle.get("start_date") == "2024-01-01" and lifecycle.get("end_date") == "2026-01-01":
             print("✅ Dates Extracted Correctly")
        else:
             print("❌ Date Extraction Failed or Values Mismatch")
             
        if lifecycle.get("notice_period_days") == 30:
            print("✅ Notice Period Extracted Correctly")
            
    except Exception as e:
        print(f"❌ Error: {e}")

async def main():
    await test_qa()
    await test_lifecycle()

if __name__ == "__main__":
    asyncio.run(main())
