import os
from langchain_cerebras import ChatCerebras
from app.core.config import settings

def get_llm(temperature=0.0):
    """
    Returns a configured ChatCerebras instance.
    """
    if not settings.CEREBRAS_API_KEY:
        raise ValueError("CEREBRAS_API_KEY is not set")
        
    return ChatCerebras(
        api_key=settings.CEREBRAS_API_KEY,
        model="llama-3.3-70b", # Using a strong model for reasoning
        temperature=temperature,
        max_retries=3,
        # fallback mechanisms can be implemented here if needed
    )
