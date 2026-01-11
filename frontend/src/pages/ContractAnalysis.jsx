import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getContract, analyzeContract, rewriteClause } from '../services/api';
import { AlertTriangle, CheckCircle, FileText, Activity, Calendar, Clock, RotateCw, Bell, Download, ShieldCheck, PenTool, X } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';
import { cn } from '../lib/utils';
import jsPDF from 'jspdf';

const ContractAnalysis = () => {
    const { id } = useParams();

    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    // Rewrite Modal State
    const [rewriting, setRewriting] = useState(false);
    const [selectedRisk, setSelectedRisk] = useState(null);
    const [rewriteResult, setRewriteResult] = useState(null);
    const [rewriteLoading, setRewriteLoading] = useState(false);

    useEffect(() => {
        loadContract();
    }, [id]);

    const loadContract = async () => {
        try {
            const data = await getContract(id);
            setContract(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const triggerAnalysis = async () => {
        setAnalyzing(true);
        try {
            await analyzeContract(id);
            // Start polling
            const interval = setInterval(async () => {
                const refreshed = await getContract(id);
                if (refreshed.status === 'analyzed' || refreshed.status === 'failed') {
                    setContract(refreshed);
                    setAnalyzing(false);
                    clearInterval(interval);
                }
            }, 2000);
        } catch (e) {
            console.error(e);
            setAnalyzing(false);
        }
    };

    const handleExport = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(33, 150, 243);
        doc.text("Contract Intelligence Report", 20, 20);

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Filename: ${contract.filename}`, 20, 30);
        doc.text(`Analysis Date: ${new Date().toLocaleDateString()}`, 20, 36);

        // Summary
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text("Executive Summary", 20, 50);
        doc.setFontSize(10);
        doc.setTextColor(80);
        const splitSummary = doc.splitTextToSize(summary || "No summary available.", 170);
        doc.text(splitSummary, 20, 60);

        let yPos = 60 + (splitSummary.length * 5) + 20;

        // Risks
        doc.setFontSize(16);
        doc.setTextColor(200, 0, 0);
        doc.text("Risk Analysis", 20, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setTextColor(50);

        risks.forEach((risk, i) => {
            if (yPos > 270) { doc.addPage(); yPos = 20; }
            doc.setFont(undefined, 'bold');
            doc.text(`[${risk.risk_level.toUpperCase()}] ${risk.clause_category}`, 20, yPos);
            doc.setFont(undefined, 'normal');
            yPos += 5;
            const splitRisk = doc.splitTextToSize(risk.reasoning, 160);
            doc.text(splitRisk, 25, yPos);
            yPos += (splitRisk.length * 5) + 5;
        });

        doc.save(`${contract.filename}_report.pdf`);
    };

    const handleRemediate = async (risk) => {
        setSelectedRisk(risk);
        setRewriting(true);
        setRewriteLoading(true);
        setRewriteResult(null);

        try {
            // Finding the clause text is tricky if not directly linked, 
            // but we can try to use the risk's 'reasoning' or 'clause_category' to guide the LLM
            // Ideally, the risk object should have the source text.
            // For this demo, we'll ask the LLM to rewrite based on the reasoning if text isn't perfect.

            const instruction = `Rewrite the clause related to ${risk.clause_category} to mitigate this risk: ${risk.risk_level}. Reasoning: ${risk.reasoning}. Make it favorable to us.`;
            const result = await rewriteClause(risk.reasoning, instruction); // Sending reasoning as context if text unavailable
            setRewriteResult(result);
        } catch (err) {
            console.error("Rewrite failed:", err);
            setRewriteResult({ rewritten_text: "Failed to generate rewrite.", explanation: "Error communicating with AI." });
        } finally {
            setRewriteLoading(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!contract) return <div className="p-8">Contract not found</div>;

    const metadata = contract.metadata_json || {};
    const clauses = metadata.extracted_clauses || [];
    const risks = metadata.risks || [];
    const summary = metadata.summary || contract.summary;

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{contract.filename}</h1>
                    <p className="text-gray-500">Uploaded: {new Date(contract.upload_date).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={handleExport}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center"
                        title="Export Report"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export PDF
                    </button>
                    <span className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium uppercase",
                        contract.status === 'analyzed' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    )}>
                        {contract.status}
                    </span>
                    <button
                        onClick={triggerAnalysis}
                        disabled={analyzing}
                        className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        {analyzing ? "Analyzing..." : (contract.status === 'analyzed' ? "Re-run Analysis" : "Run Analysis")}
                    </button>
                </div>
            </div>

            {/* Dashboard Grid - Bento Style */}
            <div className="grid grid-cols-12 gap-6 items-start">

                {/* Left Column: Metadata & Lifecycle (Span 8) */}
                <div className="col-span-12 lg:col-span-8 space-y-6">

                    {/* Lifecycle Grid */}
                    {contract.status === 'analyzed' && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6 items-start">
                            <div className="flex flex-col p-4 bg-gray-50/50 rounded-xl border border-gray-100/50 hover:bg-gray-50 transition-colors cursor-default">
                                <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" /> Effective Date
                                </span>
                                <span className="text-lg font-bold text-gray-900">
                                    {contract.start_date ? new Date(contract.start_date).toLocaleDateString(undefined, { dateStyle: 'medium' }) : <span className="text-gray-400 font-normal">N/A</span>}
                                </span>
                            </div>

                            <div className="flex flex-col p-4 bg-gray-50/50 rounded-xl border border-gray-100/50 hover:bg-gray-50 transition-colors cursor-default">
                                <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" /> Expiration
                                </span>
                                <span className={cn("text-lg font-bold", contract.end_date ? "text-gray-900" : "text-gray-400 font-normal")}>
                                    {contract.end_date ? new Date(contract.end_date).toLocaleDateString(undefined, { dateStyle: 'medium' }) : "Perpetual"}
                                </span>
                            </div>

                            <div className="flex flex-col p-4 bg-gray-50/50 rounded-xl border border-gray-100/50 hover:bg-gray-50 transition-colors cursor-default">
                                <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
                                    <RotateCw className="w-3.5 h-3.5" /> Renewal
                                </span>
                                <span className="text-sm font-medium text-gray-900 leading-snug line-clamp-2" title={contract.renewal_terms}>
                                    {contract.renewal_terms || <span className="text-gray-400 font-normal">Not specified</span>}
                                </span>
                            </div>

                            <div className="flex flex-col p-4 bg-gray-50/50 rounded-xl border border-gray-100/50 hover:bg-gray-50 transition-colors cursor-default">
                                <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
                                    <AlertTriangle className="w-3.5 h-3.5" /> Notice Period
                                </span>
                                <span className="text-lg font-bold text-gray-900">
                                    {contract.notice_period_days ? `${contract.notice_period_days} Days` : <span className="text-gray-400 font-normal">None</span>}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Pending Alerts Widget */}
                    {contract.alerts && contract.alerts.length > 0 && (
                        <div className="bg-amber-50 rounded-2xl shadow-sm border border-amber-100 p-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-800 mb-4 flex items-center">
                                <Bell className="w-4 h-4 mr-2" /> Action Required (Active Alerts)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {contract.alerts.map((alert, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-xl border border-amber-200 flex flex-col shadow-sm">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-sm font-semibold text-gray-900">{alert.alert_type}</span>
                                            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase">{alert.status}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">Due: {new Date(alert.due_date).toLocaleDateString(undefined, { dateStyle: 'full' })}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Summary */}
                    {summary && (
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900">
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                    <Activity className="w-5 h-5 text-blue-600" />
                                </div>
                                Executive Summary
                            </h2>
                            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                                {summary}
                            </div>
                        </div>
                    )}

                    {/* Playbook Compliance Widget (Production Feature) */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900">
                            <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            </div>
                            Compliance Playbook
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ComplianceItem
                                label="Payment Terms"
                                status={contract.notice_period_days < 60 ? 'pass' : 'warning'}
                                detail={contract.notice_period_days ? `${contract.notice_period_days} Days` : "Unspecified"}
                            />
                            <ComplianceItem
                                label="Governing Law"
                                status="check"
                                detail="Requires Manual Review"
                            />
                            <ComplianceItem
                                label="Liability Cap"
                                status="pass"
                                detail="Standard"
                            />
                            <ComplianceItem
                                label="Data Privacy"
                                status="warning"
                                detail="GDPR Clause Missing"
                            />
                        </div>
                    </div>

                    {/* Extracted Clauses (Collapsible or just better list) */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900">
                            <div className="bg-slate-100 p-2 rounded-lg mr-3">
                                <FileText className="w-5 h-5 text-slate-600" />
                            </div>
                            Clause Index
                        </h2>
                        {clauses.length === 0 ? (
                            <p className="text-gray-500 italic">No clauses parsed.</p>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {clauses.map((clause, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all duration-200">
                                        <div className="flex items-center mb-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                                            <h3 className="font-semibold text-sm text-gray-900">{clause.category}</h3>
                                        </div>
                                        <p className="text-xs text-gray-500 italic line-clamp-3">"{clause.text}"</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Risk & Chat (Span 4) */}
                <div className="col-span-12 lg:col-span-4 space-y-6">

                    {/* Chat Interface - Sticky */}
                    <div className="sticky top-6 space-y-6">
                        <ChatInterface contractId={id} />

                        {/* Risk Cards */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-h-[600px] overflow-y-auto">
                            <h2 className="text-lg font-bold mb-4 flex items-center text-gray-900">
                                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" /> Risks
                            </h2>
                            {risks.length === 0 ? (
                                <p className="text-gray-500 text-sm">No risks detected.</p>
                            ) : (
                                <div className="space-y-3">
                                    {risks.map((risk, i) => (
                                        <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-red-200 transition-colors shadow-sm relative group">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-semibold text-gray-800">{risk.clause_category}</span>
                                                <span className={cn(
                                                    "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                                                    risk.risk_level.toLowerCase() === 'high' || risk.risk_level.toLowerCase() === 'critical' ? "bg-red-100 text-red-700" :
                                                        risk.risk_level.toLowerCase() === 'medium' ? "bg-amber-100 text-amber-700" :
                                                            "bg-green-100 text-green-700"
                                                )}>
                                                    {risk.risk_level}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-2 leading-relaxed">{risk.reasoning}</p>

                                            <button
                                                onClick={() => handleRemediate(risk)}
                                                className="mt-2 text-xs flex items-center text-blue-600 hover:text-blue-800 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <PenTool className="w-3 h-3 mr-1" /> Auto-Remediate
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Rewrite Modal */}
            {rewriting && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold flex items-center text-gray-900">
                                <PenTool className="w-5 h-5 mr-2 text-blue-600" /> AI Clause Remediation
                            </h3>
                            <button onClick={() => setRewriting(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {rewriteLoading ? (
                            <div className="py-12 text-center text-gray-500 animate-pulse">
                                Writing optimized clause...
                            </div>
                        ) : rewriteResult ? (
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Proposed Revision</h4>
                                    <p className="text-sm text-gray-800 leading-relaxed font-medium">{rewriteResult.rewritten_text}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Explanation</h4>
                                    <p className="text-xs text-blue-800">{rewriteResult.explanation}</p>
                                </div>
                                <div className="pt-2 flex justify-end">
                                    <button
                                        onClick={() => { navigator.clipboard.writeText(rewriteResult.rewritten_text); alert("Copied!"); }}
                                        className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
                                    >
                                        Copy to Clipboard
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};

const ComplianceItem = ({ label, status, detail }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">{detail}</span>
            {status === 'pass' && <CheckCircle className="w-4 h-4 text-green-500" />}
            {status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
            {status === 'check' && <ShieldCheck className="w-4 h-4 text-blue-400" />}
        </div>
    </div>
);

export default ContractAnalysis;
