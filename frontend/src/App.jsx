import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import ContractAnalysis from './pages/ContractAnalysis';
import CompareContracts from './pages/CompareContracts';
import { LayoutDashboard } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        {/* Navigation */}
        <nav className="bg-primary text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
                  <LayoutDashboard size={24} className="text-secondary" />
                  <span>ContractAI</span>
                </Link>
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link to="/" className="hover:bg-primary-light px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                  <Link to="/upload" className="hover:bg-primary-light px-3 py-2 rounded-md text-sm font-medium">Upload</Link>
                  <Link to="/compare" className="hover:bg-primary-light px-3 py-2 rounded-md text-sm font-medium text-purple-200">Benchmarking</Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/contracts/:id" element={<ContractAnalysis />} />
            <Route path="/compare" element={<CompareContracts />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
