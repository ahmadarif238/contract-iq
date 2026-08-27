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
                <h1 className="font-serif-title text-4xl text-ink">Contract Intelligence Dashboard</h1>
                <div className="flex justify-between items-center mt-2">
                    <p className="text-ink-soft">Monitor and analyze your legal documents.</p>
                    <Link to="/compare" className="text-sm font-medium text-accent hover:text-accent-hover flex items-center bg-accent-soft px-3 py-1.5 rounded-lg border border-accent/20 transition-colors">
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
                        color="bg-accent-soft text-accent"
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

            <div className="bg-white rounded-xl shadow-sm border border-line overflow-hidden">
                <div className="p-6 border-b border-line flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-semibold text-neutral-800">Recent Contracts</h2>

                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-faint w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search contracts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent"
                            />
                        </div>
                        <Link to="/upload" className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-accent-hover transition whitespace-nowrap">
                            Upload New
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-ink-soft">Loading...</div>
                ) : (
                    <div className="divide-y divide-line">
                        {filteredContracts.length === 0 ? (
                            <div className="p-8 text-center text-ink-soft">No contracts found matching your search.</div>
                        ) : (
                            filteredContracts.map((contract) => (
                                <div key={contract.id} className="p-4 hover:bg-neutral-50 transition flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-2 rounded-lg ${contract.status === 'analyzed' ? 'bg-green-100 text-green-600' :
                                            contract.status === 'processing' ? 'bg-accent-soft text-accent' :
                                                'bg-neutral-100 text-ink-soft'
                                            }`}>
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-ink">{contract.filename}</h3>
                                            <span className="text-sm text-ink-soft">{new Date(contract.upload_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <StatusBadge status={contract.status} />
                                        <button
                                            onClick={(e) => handleDelete(contract.id, e)}
                                            className="text-ink-faint hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                                            title="Delete Contract"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <Link to={`/contracts/${contract.id}`} className="text-ink-faint hover:text-secondary p-2 hover:bg-accent-soft rounded-full">
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
        uploaded: "bg-neutral-100 text-neutral-700",
        processing: "bg-accent-soft text-accent-hover",
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
    <div className="bg-white p-6 rounded-xl border border-line shadow-sm flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-ink-soft mb-1">{label}</p>
            <h3 className="font-serif-title text-3xl text-ink">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
    </div>
);

export default Dashboard;
