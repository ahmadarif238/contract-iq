@echo off
echo Starting Backend...
start cmd /k "cd backend && venv\Scripts\activate && uvicorn app.main:app --reload"

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo Waiting for services to start...
timeout /t 5 /nobreak >nul

echo Opening Browser...
start http://localhost:5173

echo System Started!
pause
