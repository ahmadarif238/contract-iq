import os
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_community.vectorstores import FAISS
from typing import List
from app.core.config import settings

class VectorStoreManager:
    def __init__(self):
        # Initialize Embeddings (Using HuggingFace local model as before)
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.vector_store = None
        self._init_vector_store()

    def _init_vector_store(self):
        if settings.PINECONE_API_KEY:
            # Modern LangChain Pinecone usage
            # Requires PINECONE_API_KEY env var explicitly set or passed
            os.environ["PINECONE_API_KEY"] = settings.PINECONE_API_KEY
            
            self.vector_store = PineconeVectorStore(
                index_name=settings.PINECONE_INDEX_NAME,
                embedding=self.embeddings
            )
        else:
            # Fallback to local FAISS
            if os.path.exists("faiss_index"):
                self.vector_store = FAISS.load_local("faiss_index", self.embeddings, allow_dangerous_deserialization=True)
            else:
                self.vector_store = None

    def add_texts(self, texts: List[str], metadatas: List[dict] = None):
        if self.vector_store is None:
            if settings.PINECONE_API_KEY:
                 # Should have been initted in _init_vector_store but if index was empty/lazy
                 self.vector_store = PineconeVectorStore.from_texts(
                    texts, 
                    self.embeddings, 
                    index_name=settings.PINECONE_INDEX_NAME
                )
            else: 
                self.vector_store = FAISS.from_texts(texts, self.embeddings, metadatas=metadatas)
        else:
            self.vector_store.add_texts(texts, metadatas=metadatas)
        
        # Save local if using FAISS
        if not settings.PINECONE_API_KEY:
             self.vector_store.save_local("faiss_index") # type: ignore

    def similarity_search(self, query: str, k: int = 4, filter: dict = None):
        if not self.vector_store:
            return []
        if settings.PINECONE_API_KEY:
             return self.vector_store.similarity_search(query, k=k, filter=filter)
        else:
             # FAISS/Local doesn't support the same dict filter structure easily without more work
             # For now, just return k results, assuming we might filter post-retrieval or ignoring if using local dev
             # In a real prod setup with FAISS, we'd need metadata filtering enabled.
             return self.vector_store.similarity_search(query, k=k)

    def as_retriever(self):
        if self.vector_store:
            return self.vector_store.as_retriever()
        return None

vector_store_manager = VectorStoreManager()
