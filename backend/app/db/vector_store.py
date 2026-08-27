import os
from typing import List

from app.core.config import settings


class VectorStoreManager:
    """Vector store wrapper.

    Hardened (2026-08): the embedding model and vector store were built eagerly
    in `__init__`, and this module instantiates the manager at import time. So a
    missing sentence-transformers package, a blocked model download, or an
    unreachable Pinecone raised during import and took the WHOLE API down -
    the app could not even serve /health. Everything is now lazy and every
    failure degrades to "no retrieval" instead of killing the process.
    """

    def __init__(self):
        self._embeddings = None
        self._embeddings_failed = False
        self.vector_store = None
        self._initialised = False

    @property
    def embeddings(self):
        """Load the embedding model on first use; None if unavailable."""
        if self._embeddings is not None or self._embeddings_failed:
            return self._embeddings
        try:
            from langchain_huggingface import HuggingFaceEmbeddings

            self._embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        except Exception as exc:  # noqa: BLE001
            self._embeddings_failed = True
            print(f"WARNING: embeddings unavailable ({type(exc).__name__}: {exc}). "
                  f"Contract retrieval disabled; analysis still runs.")
        return self._embeddings

    def _ensure(self):
        """Initialise the vector store once, tolerating any failure."""
        if self._initialised:
            return
        self._initialised = True
        if self.embeddings is None:
            return
        try:
            self._init_vector_store()
        except Exception as exc:  # noqa: BLE001
            print(f"WARNING: vector store unavailable: {exc}")
            self.vector_store = None

    def _init_vector_store(self):
        from langchain_pinecone import PineconeVectorStore
        from langchain_community.vectorstores import FAISS

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
        from langchain_pinecone import PineconeVectorStore
        from langchain_community.vectorstores import FAISS

        self._ensure()
        if self.embeddings is None:
            print("WARNING: skipping indexing - embeddings unavailable.")
            return
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
        self._ensure()
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
        self._ensure()
        if self.vector_store:
            return self.vector_store.as_retriever()
        return None

vector_store_manager = VectorStoreManager()
