# ContractIQ 🧠⚖️
**Enterprise-Grade AI Legal Agent**

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.95+-009688.svg)](https://fastapi.tiangolo.com)
[![LangChain](https://img.shields.io/badge/LangChain-Integration-green)](https://langchain.com)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

> *"The AI Legal Assistant that replaces 'Cmd+F' with 'Intelligent Awareness'."*

---

### **Overview**
ContractIQ is an **autonomous agentic system** built to analyze, verify, and benchmark complex legal agreements. Unlike standard RAG chatbots, it uses a **Multi-Agent Graph** to not only answer questions but to *actively reason* about contract risks, extract lifecycle dates, and compare documents side-by-side.

It was engineered to solve the "Black Box" problem of legal AI by enforcing **Strict Factual Grounding**—ensuring every insight is backed by a clickable citation to the source text.

---

### **🌟 Market-Leading Features**

#### **1. Vault Intelligence (RAG at Scale)**
*   **The Problem**: Lawyers waste hours searching for "that one indemnification clause" across thousands of files.
*   **The Solution**: ContractIQ indexes the entire repository into a **Pinecone Vector Store**, allowing global semantic search.
    > *"Which vendor contracts expire in Q4 2025 and have a liability cap under $1M?"*

#### **2. Intelligent Benchmarking & Comparison**
*   **The Problem**: Comparing a vendor's draft against a company standard is manual and error-prone.
*   **The Solution**: Upload two contracts side-by-side. The agent identifies deviations, risk mismatches, and missing clauses automatically.

#### **3. Zero-Hallucination Architecture**
*   **The Problem**: LLMs love to invent numbers.
*   **The Solution**: A custom "Factual Enforcer" layer prevents the agent from inferring payment terms or dates. It only reports what is explicitly written in the text.

---

### **🛠️ Technical Architecture**

This project demonstrates proficiency in **Full-Stack AI Engineering**:

*   **AI Orchestration**: Built with **LangGraph** to manage stateful agent workflows (Ingest → Extract → Verify → Summarize).
*   **Backend**: **FastAPI** (Python) serving asynchronous endpoints for real-time analysis.
*   **Vector Database**: Hybrid architecture using **Pinecone** for semantic retrieval of contract clauses.
*   **LLM Inference**: Integrated with **Cerebras (Llama 3.1 8B)** for ultra-low latency responses.
*   **Frontend**: A modern **React (Vite)** dashboard with **TailwindCSS** for a premium, responsive UI.
*   **DevOps**: Dockerized for cloud deployment on Hugging Face Spaces.

---

### **🚀 Quick Start**

**1. Clone the Repository**
```bash
git clone https://github.com/ahmadarif238/contract-iq.git
cd contract-iq
```

**2. Start the Backend**
```bash
cd backend
pip install -r requirements.txt
# Set your .env keys (Cerebras, Pinecone)
uvicorn app.main:app --reload
```

**3. Run the Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

*Built by Ahmad Arif. Designed for Enterprise Scale.*
