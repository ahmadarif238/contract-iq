# ContractIQ: Enterprise Legal Intelligence
## *The Future of AI-Powered Contract Analytics*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/release/python-3100/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.95+-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg)](https://reactjs.org/)

---

### 🚀 **Overview**

**ContractIQ** is not just a contract wrapper—it is an **autonomous agentic system** used to analyze, verify, and benchmark complex legal agreements. Built to rival tools like Harvey AI and Spellbook, ContractIQ solves the "Black Box" problem of legal AI by enforcing **Strict Factual Grounding** and **Evidence-Based Citations**.

Unlike standard RAG chatbots, ContractIQ uses a **Multi-Agent Graph** to:
1.  **Extract** critical lifecycle dates (Expiration, Renewal, Notice Periods).
2.  **Detect** high-risk clauses (Indemnification, Liability Caps).
3.  **Benchmark** contracts against your repository or template standards.
4.  **Auto-Remediate** risky clauses with one click.

### 🌟 **Elite Features (Why this is unique)**

#### 🏦 **Vault Intelligence (Global Repository Search)**
Stop searching file-by-file. ContractIQ indexes your entire legal repository (Vector Store) allowing you to ask:
> *"Which vendor contracts expire in Q4 2025 and have a liability cap under $1M?"*
The agent scans **all documents** simultaneously and returns a cited list of matches.

#### ⚖️ **Comparisons & Benchmarking**
Upload a vendor draft and compare it side-by-side with your standard template. ContractIQ identifies:
*   **Deviation Analysis**: "This draft removes the IP Indemnity clause present in your standard."
*   **Risk Scoring**: "Vendor draft increases payment terms from 30 to 90 days."

#### 🛡️ **Zero-Hallucination Architecture**
Legal tech cannot lie. ContractIQ implements a **Strict Factual Grounding** layer:
*   It refuses to invent payment terms or dates.
*   It explicitly flags "Missing Data" rather than guessing.
*   Every answer is backed by a **clickable citation** to the exact source text.

---

### 🛠️ **Tech Stack**

**Backend (The Brain)**
*   **Framework**: FastAPI (Python)
*   **AI Orchestration**: LangGraph (Agentic Workflow)
*   **LLM Inference**: Cerebras (Llama 3.1 8B - High Speed)
*   **Vector Database**: Pinecone / FAISS (Hybrid Search)
*   **Database**: SQLite/PostgreSQL (Structured Metadata)

**Frontend (The Interface)**
*   **Framework**: React (Vite)
*   **Styling**: TailwindCSS + Framer Motion (Glassmorphism UI)
*   **Visualization**: Recharts (Analytics Dashboard)

---

### ⚡ **Quick Start**

#### **Prerequisites**
*   Python 3.10+
*   Node.js 18+
*   Pinecone API Key & Cerebras API Key

#### **1. Backend Setup**
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
```

#### **2. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

#### **3. Access the Dashboard**
Navigate to `http://localhost:5173` to upload your first contract.

---

### 🖼️ **Screenshots**

*(Placeholders for your portfolio demo)*

| **High-Risk Analysis Dashboard** | **Global Vault Search** |
|:---:|:---:|
| ![Analysis](https://via.placeholder.com/600x400?text=Risk+Analysis+View) | ![Vault](https://via.placeholder.com/600x400?text=Vault+Search+View) |

---

### 🤝 **Contact & Portfolio**

Built by **[Your Name]**.
Designed for **Enterprise Scale & Precision**.
