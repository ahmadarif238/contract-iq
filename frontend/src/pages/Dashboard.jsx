import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getContracts, deleteContract, getAnalytics } from '../services/api';
import GlobalChat from '../components/GlobalChat';

import { FileText, ChevronRight, AlertTriangle, CheckCircle, Trash2, Search, Filter, BarChart3, Clock, ShieldAlert } from 'lucide-react';

const Dashboard = () => {
    const [contracts, setContracts] = useState([]);
    const [filteredContracts, setFilteredContracts] = useState([]);
    const [stats, setStats] = useState({ total_contracts: 0, analyzed_contracts: 0, high_risks: 0, expiring_soon: 0 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [contractsData, statsData] = await Promise.all([
                getContracts(),
                getAnalytics()
            ]);
            setContracts(contractsData);
            setFilteredContracts(contractsData);
            setStats(statsData);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const results = contracts.filter(contract =>
            contract.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contract.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredContracts(results);
    }, [searchTerm, contracts]);

    const handleDelete = async (id, e) => {
        e.preventDefault(); // Prevent navigation
        if (window.confirm("Are you sure you want to delete this contract? This action cannot be undone.")) {
            try {
                await deleteContract(id);
                fetchData(); // Refresh list & stats
            } catch (error) {
                console.error("Error deleting contract:", error);
                alert("Failed to delete contract");
            }
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Contract Intelligence Dashboard</h1>
                <div className="flex justify-between items-center mt-2">
                    <p className="text-gray-500">Monitor and analyze your legal documents.</p>
                    <Link to="/compare" className="text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100 transition-colors">
                        <BarChart3 className="w-4 h-4 mr-1.5" /> Benchmarks & Compare
                    </Link>
                </div>
            </header>

            {/* Analytics Stats Bar (Production Feature) */}
            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        label="Total Contracts"
                        value={stats.total_contracts}
                        icon={FileText}
                        color="bg-blue-50 text-blue-600"
                    />
                    <StatCard
                        label="Analyzed"
                        value={stats.analyzed_contracts}
                        icon={CheckCircle}
                        color="bg-green-50 text-green-600"
                    />
                    <StatCard
                        label="High Risks"
                        value={stats.high_risks}
                        icon={ShieldAlert}
                        color="bg-red-50 text-red-600"
                    />
                    <StatCard
                        label="Expiring Soon"
                        value={stats.expiring_soon}
                        icon={Clock}
                        color="bg-amber-50 text-amber-600"
                    />
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Contracts</h2>

                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search contracts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                            />
                        </div>
                        <Link to="/upload" className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition whitespace-nowrap">
                            Upload New
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredContracts.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No contracts found matching your search.</div>
                        ) : (
                            filteredContracts.map((contract) => (
                                <div key={contract.id} className="p-4 hover:bg-gray-50 transition flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-2 rounded-lg ${contract.status === 'analyzed' ? 'bg-green-100 text-green-600' :
                                            contract.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{contract.filename}</h3>
                                            <span className="text-sm text-gray-500">{new Date(contract.upload_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <StatusBadge status={contract.status} />
                                        <button
                                            onClick={(e) => handleDelete(contract.id, e)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                                            title="Delete Contract"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <Link to={`/contracts/${contract.id}`} className="text-gray-400 hover:text-secondary p-2 hover:bg-blue-50 rounded-full">
                                            <ChevronRight size={20} />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
            <GlobalChat />
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        uploaded: "bg-gray-100 text-gray-700",
        processing: "bg-blue-100 text-blue-700",
        analyzed: "bg-green-100 text-green-700",
        failed: "bg-red-100 text-red-700",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${styles[status] || styles.uploaded}`}>
            {status}
        </span>
    );
};



const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
    </div>
);

export default Dashboard;
