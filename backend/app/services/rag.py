from typing import List, Tuple
from app.db.vector_store import vector_store_manager
from langchain_core.documents import Document

class RAGService:
    def retrieve(self, query: str, k: int = 4, filter: dict = None) -> List[Document]:
        """
        Retrieves relevant documents for a given query.
        """
        return vector_store_manager.similarity_search(query, k=k, filter=filter)

    def format_docs(self, docs: List[Document]) -> str:
        """
        Formats retrieved documents into a string for the LLM context.
        """
        return "\n\n".join(f"Source: {d.metadata.get('source', 'Unknown')}\nContent: {d.page_content}" for d in docs)

rag_service = RAGService()
