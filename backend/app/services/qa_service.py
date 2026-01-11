import json
from langchain_core.messages import SystemMessage, HumanMessage
from app.core.llm import get_llm
from app.services.rag import rag_service

class QAService:
    def __init__(self):
        self.llm = get_llm(temperature=0.0) # Low temp for factual answers

    async def ask_question(self, question: str, contract_id: int = None):
        # 1. Retrieve relevant chunks (Global or Specific)
        filter_dict = {"contract_id": contract_id} if contract_id else None
        
        # Increase k for global search to capture more context
        k = 5 if contract_id else 10
        docs = rag_service.retrieve(question, k=k, filter=filter_dict)
        
        if not docs:
             return {
                "answer": "I could not find any relevant information in your contracts to answer your question.",
                "citations": [],
                "confidence": "low"
            }

        context = rag_service.format_docs(docs)
        
        # 2. Construct Prompt
        # Rigid prompt for structured output and strict grounding
        prompt_text = f"""
        You are a strict legal analyst. Answer the user's question based ONLY on the provided contract context.
        
        Context:
        {context}
        
        Question: 
        {question}
        
        Requirements:
        1. Answer directly and concisely.
        2. Provide CITATIONS: exact clause text from the context that supports your answer.
        3. Identify the Clause Type (e.g., "Termination", "Confidentiality").
        4. If the answer is NOT in the context, explicitly state: "The contract does not contain information regarding [topic]."
        5. DO NOT hallucinate or use outside knowledge.
        
        Return the response in the following JSON format:
        {{
            "answer": "Direct answer here...",
            "citations": [
                {{
                    "clause_text": "Exact text from contract...",
                    "clause_type": "Type...",
                    "explanation": "Why this supports the answer..."
                }}
            ],
            "confidence": "High|Medium|Low"
        }}
        """

        # 3. Call LLM
        try:
            response = await self.llm.ainvoke([HumanMessage(content=prompt_text)])
            content = response.content.strip()
            
            # Robust JSON extraction
            import re
            
            # Try to find JSON block
            json_match = re.search(r"\{.*\}", content, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
            else:
                json_str = content
            
            try:
                return json.loads(json_str)
            except json.JSONDecodeError:
                # Fallback if invalid JSON
                print(f"Failed to parse JSON. Content: {content}")
                return {
                    "answer": content[:500] + "...", # Return raw text if JSON fails
                    "citations": [],
                    "confidence": "low"
                }

        except Exception as e:
            print(f"Error in QAService: {e}")
            return {
                "answer": f"I encountered an error analyzing the contracts. ({str(e)})",
                "citations": [],
                "confidence": "zero"
            }

    async def rewrite_clause(self, clause_text: str, instruction: str) -> dict:
        """
        Rewrites a legal clause based on instructions.
        """
        prompt = f"""
        You are an expert contract literacy lawyer. Your task is to rewrite the following contract clause.
        
        Original Clause:
        "{clause_text}"
        
        Instruction:
        {instruction}
        
        Requirements:
        1. Maintain professional legal tone.
        2. Be precise and concise.
        3. Explain the change briefly.
        
        Output JSON:
        {{
            "rewritten_text": "...",
            "explanation": "..."
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
                "rewritten_text": "Error generating rewrite.",
                "explanation": str(e)
            }

qa_service = QAService()
