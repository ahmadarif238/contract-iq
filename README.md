# ContractIQ 🧠⚖️
**The AI Legal Assistant for Humans.**

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### **What is ContractIQ?**
ContractIQ is an AI agent that reads, understands, and checks legal contracts for you. It helps you find risks, answer questions, and compare documents in seconds—without the legal jargon.

---

### **✨ What It Does**

✅ **Risk Detection**  
Instantly finds dangerous terms like "Unlimited Liability" or "Missing Payment Terms" and warns you before you sign.

✅ **Answers Questions**  
Ask anything like *"What is the notice period for checking out?"* and it gives you the answer with a **direct link** to the text in the document.

✅ **Compares Contracts**  
Upload a vendor's draft and compare it to your standard agreement. See exactly what changed and why it matters.

✅ **No Hallucinations**  
Unlike standard ChatGPT, ContractIQ **never invents info**. If a date or number isn't in the file, it tells you "Not Found" instead of guessing.

---

### **🚀 How to Run It**

**1. Backend (The Brain)**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**2. Frontend (The App)**
```bash
cd frontend
npm install
npm run dev
```

**3. Open in Browser**  
Go to `http://localhost:5173` to start analyzing contracts.

---

### **🛠️ Tech Stack (For Developers)**
*   **AI**: LangChain, Cerebras (Llama 3.1), RAG Architecture
*   **Backend**: FastAPI, Python, SQLite, Vector Search (Pinecone)
*   **Frontend**: React, TailwindCSS, Vite
*   **Deployment**: Docker (Hugging Face Spaces), Vercel

---
*Built to bring transparency to legal agreements.*
