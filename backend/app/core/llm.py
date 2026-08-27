import os
from langchain_groq import ChatGroq
from app.core.config import settings


def get_llm(temperature=0.0):
    """
    Returns a configured ChatGroq instance.

    Migrated off Cerebras (2026-08): the Cerebras free tier now returns
    `payment_required` for every request, and the model this project used
    ("llama-3.3-70b") no longer exists on either provider. Groq's free tier
    still works; its current production line-up is the openai/gpt-oss-* family.
    """
    if not settings.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set")

    return ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model=settings.GROQ_MODEL,
        temperature=temperature,
        max_retries=3,
        # gpt-oss reasons before answering. Hide the chain of thought so callers
        # parsing `.content` (JSON clause extraction, risk scoring) stay valid.
        reasoning_format="hidden",
        reasoning_effort="low",
    )
