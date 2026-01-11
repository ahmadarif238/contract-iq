import os
from typing import List, Optional
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from app.db.vector_store import vector_store_manager

class IngestionService:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", " ", ""]
        )

    async def ingest_file(self, file_path: str, contract_id: int) -> int:
        """
        Ingests a file, chunks it, and stores it in the vector store.
        Returns the number of chunks created.
        """
        ext = os.path.splitext(file_path)[1].lower()
        
        if ext == ".pdf":
            loader = PyPDFLoader(file_path)
            documents = loader.load()
        elif ext == ".docx":
            loader = Docx2txtLoader(file_path)
            documents = loader.load()
        else:
            raise ValueError(f"Unsupported file type: {ext}")
            
        # Add metadata
        for doc in documents:
            doc.metadata["contract_id"] = contract_id
            doc.metadata["source"] = os.path.basename(file_path)
            
        chunks = self.text_splitter.split_documents(documents)
        
        # Store in Vector DB
        texts = [c.page_content for c in chunks]
        metadatas = [c.metadata for c in chunks]
        
        vector_store_manager.add_texts(texts, metadatas)
        
        return len(chunks)

ingestion_service = IngestionService()
