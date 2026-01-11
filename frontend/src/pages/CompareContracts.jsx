import React, { useState, useEffect } from 'react';
import { getContracts, compareContracts } from '../services/api';
import { ArrowRightLeft, CheckCircle, AlertTriangle, Shield, Scale } from 'lucide-react';

const CompareContracts = () => {
    const [contracts, setContracts] = useState([]);
    const [selection, setSelection] = useState({ id1: '', id2: '' });
    const [comparison, setComparison] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadContracts();
    }, []);

    const loadContracts = async () => {
        try {
            const data = await getContracts();
            setContracts(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCompare = async () => {
        if (!selection.id1 || !selection.id2) return;
        setLoading(true);
        setComparison(null);
        setError(null);

        try {
            const result = await compareContracts(selection.id1, selection.id2);
            setComparison(result);
        } catch (err) {
            setError("Failed to compare contracts. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getContractName = (id) => contracts.find(c => c.id === parseInt(id))?.filename || "Unknown";

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-8 flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                    <Scale className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Benchmarking & Comparison</h1>
                    <p className="text-gray-500">Compare two contracts side-by-side to identify deviations and risks.</p>
                </div>
            </header>

            {/* Selection Panel */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contract A (Baseline)</label>
                        <select
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            value={selection.id1}
                            onChange={(e) => setSelection({ ...selection, id1: e.target.value })}
                        >
                            <option value="">Select Contract...</option>
                            {contracts.map(c => <option key={c.id} value={c.id}>{c.filename}</option>)}
                        </select>
                    </div>

                    <div className="hidden md:flex items-center justify-center pt-6">
                        <ArrowRightLeft className="text-gray-400" />
                    </div>

                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contract B (Target)</label>
                        <select
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            value={selection.id2}
                            onChange={(e) => setSelection({ ...selection, id2: e.target.value })}
                        >
                            <option value="">Select Contract...</option>
                            {contracts.map(c => <option key={c.id} value={c.id} disabled={c.id == selection.id1}>{c.filename}</option>)}
                        </select>
                    </div>

                    <button
                        onClick={handleCompare}
                        disabled={!selection.id1 || !selection.id2 || loading}
                        className="w-full md:w-auto mt-6 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                    >
                        {loading ? "Comparing..." : "Run Comparison"}
                    </button>
                </div>
            </div>

            {/* Results */}
            {comparison && (
                <div className="space-y-6 animate-fade-in">
                    {/* Overview */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <Shield className="w-5 h-5 mr-2 text-purple-600" /> Executive Summary
                        </h3>
                        <p className="text-gray-700 leading-relaxed">{comparison.overview_diff}</p>

                        <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-lg">
                            <h4 className="text-sm font-bold text-purple-700 uppercase tracking-wide mb-1">Recommendation</h4>
                            <p className="text-purple-900 font-medium">{comparison.recommendation}</p>
                        </div>
                    </div>

                    {/* Diff Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">{getContractName(selection.id1)}</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">{getContractName(selection.id2)}</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">AI Assessment</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {comparison.key_differences.map((diff, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{diff.category}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{diff.contract_a_point}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{diff.contract_b_point}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800 bg-purple-50/50 font-medium">{diff.assessment}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompareContracts;
