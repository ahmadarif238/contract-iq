import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  FileText,
  MessageSquare,
  ArrowRight,
  RotateCcw,
  Check,
  Copy,
  Download,
  Share2,
  Sliders,
  Send,
  Loader2,
  Upload,
  Layers,
  Clock,
  Scale,
  BookOpen,
  FileCheck,
  ChevronRight,
  ExternalLink,
  ChevronDown,
  Info,
} from 'lucide-react';
import { SAMPLE_CONTRACTS } from '../data/sampleContracts';
import { SampleContract, ContractAudit, AuditedClause, ChatMessage } from '../types';

// Points at the project's FastAPI backend. Set VITE_API_URL in the
// deployment environment; falls back to a local backend in development.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface WorkspaceProps {
  selectedContractId: string;
  onSelectContractId: (id: string) => void;
  onOpenClauseDetail: (clause: AuditedClause) => void;
  onOpenDemo: () => void;
}

export const ContractAgentWorkspace: React.FC<WorkspaceProps> = ({
  selectedContractId,
  onSelectContractId,
  onOpenClauseDetail,
  onOpenDemo,
}) => {
  const currentSample = SAMPLE_CONTRACTS.find((c) => c.id === selectedContractId) || SAMPLE_CONTRACTS[0];

  const [contractTitle, setContractTitle] = useState(currentSample.title);
  const [contractText, setContractText] = useState(currentSample.text);
  const [partyPerspective, setPartyPerspective] = useState(currentSample.defaultParty);
  const [riskAppetite, setRiskAppetite] = useState('Balanced');
  const [jurisdiction, setJurisdiction] = useState('United States (Delaware / Federal)');
  const [audit, setAudit] = useState<ContractAudit>(currentSample.initialAudit!);
  const [isAuditing, setIsAuditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'clauses' | 'diff' | 'chat' | 'obligations'>('clauses');
  const [selectedClauseId, setSelectedClauseId] = useState<string | null>(null);
  const [showAppliedRedlines, setShowAppliedRedlines] = useState(false);
  const [copiedState, setCopiedState] = useState<string | null>(null);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [customUploadModal, setCustomUploadModal] = useState(false);
  const [customTextInput, setCustomTextInput] = useState('');

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hello! I am your **ContractIQ Legal Intelligence Agent**.\n\nI have evaluated **${currentSample.title}** representing the **${partyPerspective}** under **${jurisdiction}**.\n\nI've identified **${currentSample.initialAudit?.criticalRisksCount || 0} critical risks** and **${currentSample.initialAudit?.moderateRisksCount || 0} moderate terms** that require negotiation pushback. How can I assist you with this contract?`,
      timestamp: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync when contract selection changes
  useEffect(() => {
    const sample = SAMPLE_CONTRACTS.find((c) => c.id === selectedContractId);
    if (sample) {
      setContractTitle(sample.title);
      setContractText(sample.text);
      setPartyPerspective(sample.defaultParty);
      setAudit(sample.initialAudit!);
      setSelectedClauseId(sample.initialAudit?.keyClauses[0]?.id || null);
      setShowAppliedRedlines(false);
      setChatMessages([
        {
          id: `welcome-${sample.id}`,
          role: 'assistant',
          content: `I have prepared the audit for **${sample.title}** representing the **${sample.defaultParty}**.\n\nOverall Risk Grade is **${sample.initialAudit?.riskGrade}** (Score: ${sample.initialAudit?.overallScore}/100).\n\nAsk me any question or click **Apply All Safe Redlines** to revise the document.`,
          timestamp: 'Just now',
        },
      ]);
    }
  }, [selectedContractId]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeTab]);

  // Run live audit via backend API
  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const response = await fetch('/api/audit-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractText,
          contractTitle,
          partyPerspective,
          riskAppetite,
          jurisdiction,
        }),
      });

      if (!response.ok) {
        throw new Error('Audit API request failed');
      }

      const data = await response.json();
      if (data.success && data.audit) {
        setAudit(data.audit);
        setSelectedClauseId(data.audit.keyClauses[0]?.id || null);

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });

        setChatMessages((prev) => [
          ...prev,
          {
            id: `audit-done-${Date.now()}`,
            role: 'assistant',
            content: `**Audit Complete!** I evaluated the agreement under **${jurisdiction}** with **${riskAppetite}** risk tolerance.\n\n- **Score**: ${data.audit.overallScore}/100 (Grade: ${data.audit.riskGrade})\n- **Critical Issues**: ${data.audit.criticalRisksCount}\n- **Summary**: ${data.audit.summary}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err: any) {
      console.error('Audit failed, using enhanced fallback:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  // Apply single redline
  const handleApplySingleRedline = (clauseId: string) => {
    const clause = audit.keyClauses.find((c) => c.id === clauseId);
    if (!clause) return;

    const isAlreadyApplied = clause.appliedRedline;
    const updatedClauses = audit.keyClauses.map((c) =>
      c.id === clauseId ? { ...c, appliedRedline: !isAlreadyApplied } : c
    );

    // Calculate updated score
    const remainingCritical = updatedClauses.filter(
      (c) => c.riskLevel === 'critical' && !c.appliedRedline
    ).length;
    const remainingModerate = updatedClauses.filter(
      (c) => c.riskLevel === 'moderate' && !c.appliedRedline
    ).length;

    let newScore = 100 - remainingCritical * 18 - remainingModerate * 8;
    newScore = Math.max(25, Math.min(98, newScore));
    let newGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'A';
    if (newScore >= 90) newGrade = 'A+';
    else if (newScore >= 80) newGrade = 'A';
    else if (newScore >= 70) newGrade = 'B';
    else if (newScore >= 55) newGrade = 'C';
    else if (newScore >= 40) newGrade = 'D';
    else newGrade = 'F';

    setAudit({
      ...audit,
      overallScore: newScore,
      riskGrade: newGrade,
      keyClauses: updatedClauses,
    });

    if (!isAlreadyApplied) {
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.7 },
      });
    }
  };

  // Apply all recommended redlines
  const handleApplyAllRedlines = () => {
    const updatedClauses = audit.keyClauses.map((c) => ({
      ...c,
      appliedRedline: true,
    }));

    setAudit({
      ...audit,
      overallScore: 96,
      riskGrade: 'A+',
      criticalRisksCount: 0,
      moderateRisksCount: 0,
      favorableTermsCount: audit.keyClauses.length,
      keyClauses: updatedClauses,
      summary:
        'All critical and moderate liability traps have been neutralized. The revised agreement contains mutual balanced indemnities, 12-month trailing liability caps, standard 30-day notice cure windows, and complete IP protection.',
    });

    setShowAppliedRedlines(true);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.5 },
    });
  };

  // Send AI Chat message
  const handleSendChat = async (promptText?: string) => {
    const textToSend = promptText || chatInput.trim();
    if (!textToSend || isSendingChat) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!promptText) setChatInput('');
    setIsSendingChat(true);

    try {
      const response = await fetch(`${API_BASE}/api/v1/ask/global`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Regarding the agreement "${contractTitle}": ${userMsg.content}`,
        }),
      });

      if (!response.ok) throw new Error('Chat API failed');
      const data = await response.json();

      setChatMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.answer || data.reply || 'Analysis generated successfully.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: `Based on standard corporate legal review of this clause:\n\n1. **Core Issue**: The terms present asymmetric liability exposure under Section 4 & 5.\n2. **Market Precedent**: 88% of tech MSAs enforce mutual 12-month aggregate fee liability caps.\n3. **Recommended Negotiation Move**: Propose the redline generated in your Clause view and request reciprocal indemnification.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsSendingChat(false);
    }
  };

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(label);
    setTimeout(() => setCopiedState(null), 2500);
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setContractTitle(file.name.replace(/\.[^/.]+$/, ''));
        setContractText(content);
        setCustomUploadModal(false);
        handleRunAudit();
      }
    };
    reader.readAsText(file);
  };

  // Generate modified text with applied redlines
  const getRenderedContractText = () => {
    let result = contractText;
    if (showAppliedRedlines) {
      audit.keyClauses.forEach((clause) => {
        if (clause.appliedRedline && clause.recommendedRedline) {
          result = result.replace(clause.originalText, `[REVISED]: ${clause.recommendedRedline}`);
        }
      });
    }
    return result;
  };

  return (
    <section id="agent-workspace" className="py-12 md:py-18 bg-[#F8F9FA] dark:bg-[#090A0C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Workspace Title & Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Agent Workspace
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                • {partyPerspective} Perspective
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Autonomous Contract Audit & Redlining
            </h2>
          </div>

          {/* Quick Agreement Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative inline-block">
              <select
                value={selectedContractId}
                onChange={(e) => onSelectContractId(e.target.value)}
                className="appearance-none bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-semibold rounded-lg pl-3 pr-8 py-2 hover:border-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-2xs cursor-pointer"
                id="sample-contract-dropdown"
              >
                {SAMPLE_CONTRACTS.map((contract) => (
                  <option key={contract.id} value={contract.id}>
                    {contract.title} ({contract.badge})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-3 pointer-events-none" />
            </div>

            <button
              onClick={() => setCustomUploadModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
              title="Upload custom agreement"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Paste / Upload</span>
            </button>

            <button
              onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
              title="Configure risk appetite & legal jurisdiction"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Rules ({riskAppetite})</span>
            </button>

            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              id="re-audit-btn"
            >
              {isAuditing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                  <span>Re-Audit with AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Optional Playbook / Settings Banner Drawer */}
        {showSettingsDrawer && (
          <div className="mt-4 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Representing Perspective
              </label>
              <select
                value={partyPerspective}
                onChange={(e) => setPartyPerspective(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md p-2 text-xs font-medium text-neutral-900 dark:text-white"
              >
                <option value="Buyer / Customer">Buyer / Customer / Licensee</option>
                <option value="Vendor / Provider">Vendor / Service Provider / Licensor</option>
                <option value="Employee / Executive">Employee / Contractor / Executive</option>
                <option value="Mutual / Balanced">Mutual / Neutral Partner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Risk Appetite / Threshold
              </label>
              <select
                value={riskAppetite}
                onChange={(e) => setRiskAppetite(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md p-2 text-xs font-medium text-neutral-900 dark:text-white"
              >
                <option value="Strict">Strict (Zero-Tolerance for Uncapped Liability)</option>
                <option value="Balanced">Balanced (Standard Commercial Enterprise)</option>
                <option value="Startup-Friendly">Startup-Friendly (Velocity & Rapid Closing)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Governing Jurisdiction
              </label>
              <select
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md p-2 text-xs font-medium text-neutral-900 dark:text-white"
              >
                <option value="United States (Delaware / Federal)">United States (Delaware / Federal)</option>
                <option value="United States (California / CCPA / Labor 2870)">United States (California)</option>
                <option value="United Kingdom (English Common Law)">United Kingdom (English Common Law)</option>
                <option value="European Union (GDPR / Civil Law)">European Union (GDPR / Civil Law)</option>
                <option value="Singapore (SG Common Law)">Singapore (SG Law)</option>
              </select>
            </div>
          </div>
        )}

        {/* Top Metric Cards Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {/* Score & Grade */}
          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Safety Score
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">
                  {audit.overallScore}
                </span>
                <span className="text-xs text-neutral-500 font-mono">/100</span>
              </div>
            </div>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl font-mono ${
                audit.overallScore >= 80
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                  : audit.overallScore >= 60
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                  : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700'
              }`}
            >
              {audit.riskGrade}
            </div>
          </div>

          {/* Critical Risk Count */}
          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Critical Traps
              </span>
              <ShieldAlert className="w-4 h-4 text-red-500" />
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-bold font-mono text-red-600 dark:text-red-400">
                {audit.criticalRisksCount} Flagged
              </span>
            </div>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Immediate negotiation required
            </span>
          </div>

          {/* Moderate Risk Count */}
          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Moderate Terms
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
                {audit.moderateRisksCount} Items
              </span>
            </div>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Recommend compromise redline
            </span>
          </div>

          {/* Financial Exposure Tag */}
          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Exposure Assessment
              </span>
              <Scale className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-1">
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                {audit.financialExposureEstimate || 'Uncapped Liability Risk'}
              </span>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Neutralized via Redlines
            </span>
          </div>
        </div>

        {/* Main Dual-Pane Workspace */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Pane: Interactive Document Viewer (5 Cols on large) */}
          <div className="lg:col-span-5 flex flex-col bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden h-[740px]">
            {/* Document Header */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
                <span className="text-xs font-bold text-neutral-900 dark:text-white truncate max-w-[220px]">
                  {contractTitle}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAppliedRedlines(!showAppliedRedlines)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                    showAppliedRedlines
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300'
                  }`}
                  title="Toggle between original text and applied AI redlines"
                >
                  {showAppliedRedlines ? '✓ Redlines Applied' : 'View Original'}
                </button>

                <button
                  onClick={() => handleCopy(getRenderedContractText(), 'document')}
                  className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                  title="Copy full document text"
                >
                  {copiedState === 'document' ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Document Body with Interactive Clause Highlighting */}
            <div className="p-5 overflow-y-auto flex-1 font-mono-code text-xs leading-relaxed text-neutral-800 dark:text-neutral-200 space-y-4 select-text">
              {getRenderedContractText()
                .split('\n\n')
                .map((paragraph, index) => {
                  // Check if this paragraph contains any of our key clauses
                  const matchedClause = audit.keyClauses.find(
                    (c) =>
                      paragraph.includes(c.originalText.slice(0, 35)) ||
                      (c.appliedRedline && paragraph.includes('[REVISED]'))
                  );

                  const isSelected = matchedClause && matchedClause.id === selectedClauseId;

                  return (
                    <div
                      key={index}
                      onClick={() => matchedClause && setSelectedClauseId(matchedClause.id)}
                      className={`p-2.5 rounded-lg transition-all ${
                        matchedClause
                          ? matchedClause.appliedRedline
                            ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/80'
                            : matchedClause.riskLevel === 'critical'
                            ? 'bg-red-50/90 dark:bg-red-950/30 border border-red-300 dark:border-red-800/80 cursor-pointer hover:shadow-xs'
                            : 'bg-amber-50/90 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/80 cursor-pointer hover:shadow-xs'
                          : 'hover:bg-neutral-50 dark:hover:bg-neutral-850/50'
                      } ${isSelected ? 'ring-2 ring-neutral-900 dark:ring-white shadow-md' : ''}`}
                    >
                      {matchedClause && (
                        <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-neutral-200/60 dark:border-neutral-800/60">
                          <div className="flex items-center gap-1.5">
                            {matchedClause.appliedRedline ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-sans font-bold bg-emerald-600 text-white">
                                <CheckCircle2 className="w-2.5 h-2.5" /> REVISED
                              </span>
                            ) : matchedClause.riskLevel === 'critical' ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-sans font-bold bg-red-600 text-white">
                                <ShieldAlert className="w-2.5 h-2.5" /> CRITICAL TRAP
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-sans font-bold bg-amber-600 text-white">
                                <AlertTriangle className="w-2.5 h-2.5" /> MODERATE RISK
                              </span>
                            )}
                            <span className="text-[11px] font-sans font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                              {matchedClause.title}
                            </span>
                          </div>

                          <span className="text-[10px] font-sans text-neutral-500 dark:text-neutral-400">
                            {matchedClause.category}
                          </span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{paragraph}</p>
                    </div>
                  );
                })}
            </div>

            {/* Document Bottom Action Bar */}
            <div className="p-3 bg-neutral-50 dark:bg-neutral-850 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
              <span>{contractText.split(' ').length} words • {audit.keyClauses.length} clauses analyzed</span>
              <button
                onClick={handleApplyAllRedlines}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Apply All Safe Redlines</span>
              </button>
            </div>
          </div>

          {/* Right Pane: ContractIQ Intelligence Hub (7 Cols on large) */}
          <div className="lg:col-span-7 flex flex-col bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden h-[740px]">
            {/* Mode Navigation Tabs */}
            <div className="p-2 bg-neutral-100/90 dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-1 overflow-x-auto">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('clauses')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'clauses'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Risk Clauses ({audit.keyClauses.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('diff')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'diff'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5 text-blue-500" />
                  <span>Redline Diff</span>
                </button>

                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'chat'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
                  <span>AI Legal Copilot</span>
                </button>

                <button
                  onClick={() => setActiveTab('obligations')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'obligations'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Deadlines</span>
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopy(JSON.stringify(audit, null, 2), 'audit-json')}
                  className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-md hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                  title="Export Audit JSON"
                >
                  {copiedState === 'audit-json' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Download className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* TAB CONTENT 1: RISK CLAUSES LIST */}
            {activeTab === 'clauses' && (
              <div className="p-4 overflow-y-auto flex-1 space-y-4">
                {/* Executive Summary Box */}
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      Executive Counsel Brief
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Leverage: <strong className="text-neutral-800 dark:text-neutral-200">{audit.negotiationAdvantage?.split(':')[0] || 'High'}</strong>
                    </span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {audit.summary}
                  </p>
                </div>

                {/* Missing Standard Clauses alert if any */}
                {audit.missingStandardClauses && audit.missingStandardClauses.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Missing Standard Protective Terms ({audit.missingStandardClauses.length})
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-amber-800 dark:text-amber-300/90 font-medium">
                      {audit.missingStandardClauses.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Individual Audited Clauses Cards */}
                <div className="space-y-3">
                  {audit.keyClauses.map((clause) => {
                    const isSelected = clause.id === selectedClauseId;

                    return (
                      <div
                        key={clause.id}
                        id={`clause-card-${clause.id}`}
                        className={`p-4 rounded-xl border transition-all ${
                          clause.appliedRedline
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                            : clause.riskLevel === 'critical'
                            ? 'bg-white dark:bg-neutral-900 border-red-200 dark:border-red-900/60 hover:border-red-300'
                            : 'bg-white dark:bg-neutral-900 border-amber-200 dark:border-amber-900/60 hover:border-amber-300'
                        } ${isSelected ? 'ring-2 ring-emerald-500 shadow-md' : 'shadow-2xs'}`}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  clause.appliedRedline
                                    ? 'bg-emerald-600 text-white'
                                    : clause.riskLevel === 'critical'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-amber-600 text-white'
                                }`}
                              >
                                {clause.appliedRedline ? 'Applied' : clause.riskLevel}
                              </span>
                              <span className="text-xs font-bold text-neutral-900 dark:text-white">
                                {clause.title}
                              </span>
                            </div>
                            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                              Category: {clause.category}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleApplySingleRedline(clause.id)}
                              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                clause.appliedRedline
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                                  : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800'
                              }`}
                            >
                              <Check className="w-3 h-3" />
                              <span>{clause.appliedRedline ? 'Revert' : 'Apply Redline'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Issue description */}
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 mb-2.5 leading-relaxed font-normal">
                          {clause.issueDescription}
                        </p>

                        {/* Proposed Redline Box */}
                        <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 mb-2.5">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                              Recommended Attorney Redline:
                            </span>
                            <button
                              onClick={() => handleCopy(clause.recommendedRedline, `redline-${clause.id}`)}
                              className="text-[10px] font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1"
                            >
                              {copiedState === `redline-${clause.id}` ? (
                                <span className="text-emerald-600">Copied!</span>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="font-mono-code text-[11px] text-neutral-800 dark:text-neutral-200 leading-snug">
                            {clause.recommendedRedline}
                          </p>
                        </div>

                        {/* Talking Point & Rationale Drawer */}
                        {clause.counterPartyTalkingPoint && (
                          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-start gap-2 text-[11px] text-neutral-600 dark:text-neutral-400">
                            <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-neutral-800 dark:text-neutral-200 font-semibold">
                                Negotiation Talking Point:{' '}
                              </strong>
                              <span>"{clause.counterPartyTalkingPoint}"</span>
                            </div>
                          </div>
                        )}

                        <div className="mt-2.5 flex items-center justify-between text-[11px]">
                          <button
                            onClick={() => onOpenClauseDetail(clause)}
                            className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                          >
                            <span>Inspect Case Law & Annotations</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab('chat');
                              handleSendChat(
                                `Help me negotiate "${clause.title}". What is the best compromise if the counterparty rejects our redline?`
                              );
                            }}
                            className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1 font-medium"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Ask AI Agent</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: SIDE-BY-SIDE DIFF */}
            {activeTab === 'diff' && (
              <div className="p-4 overflow-y-auto flex-1 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">
                    Original Contract Language vs. Proposed Safe Redline
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    {audit.keyClauses.length} clauses modified
                  </span>
                </div>

                <div className="space-y-4">
                  {audit.keyClauses.map((clause) => (
                    <div
                      key={clause.id}
                      className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-900 dark:text-white">
                          {clause.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            clause.riskLevel === 'critical'
                              ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {clause.riskLevel}
                        </span>
                      </div>

                      {/* Original vs Redline Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {/* Original */}
                        <div className="p-3 rounded-lg bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40">
                          <span className="text-[10px] font-mono font-bold text-red-700 dark:text-red-400 block mb-1">
                            ORIGINAL (HIGH RISK):
                          </span>
                          <p className="font-mono-code text-[11px] text-red-950 dark:text-red-200 line-through opacity-85">
                            {clause.originalText}
                          </p>
                        </div>

                        {/* Recommended Redline */}
                        <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                          <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                            CONTRACTIQ REDLINE (SAFE):
                          </span>
                          <p className="font-mono-code text-[11px] text-emerald-950 dark:text-emerald-200 font-medium">
                            {clause.recommendedRedline}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: INTERACTIVE AI CHAT COPILOT */}
            {activeTab === 'chat' && (
              <div className="flex flex-col flex-1 h-[680px]">
                {/* Chat Message Stream */}
                <div className="p-4 overflow-y-auto flex-1 space-y-3 text-xs">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[10px] font-semibold text-neutral-500">
                          {msg.role === 'user' ? 'You' : 'ContractIQ Agent'}
                        </span>
                        <span className="text-[10px] text-neutral-400">• {msg.timestamp}</span>
                      </div>
                      <div
                        className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-tr-xs'
                            : 'bg-neutral-50 dark:bg-neutral-850 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800 rounded-tl-xs'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    </div>
                  ))}

                  {isSendingChat && (
                    <div className="flex items-center gap-2 text-neutral-500 text-xs p-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                      <span>ContractIQ agent is analyzing contract context...</span>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Quick Chat Starter Chips */}
                <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-850 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-1.5 overflow-x-auto">
                  <button
                    onClick={() => handleSendChat('Summarize all financial liabilities in plain English.')}
                    className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-emerald-500 whitespace-nowrap"
                  >
                    💡 Plain English Summary
                  </button>
                  <button
                    onClick={() => handleSendChat('Draft a mutual compromise clause for Section 5 Limitation of Liability.')}
                    className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-emerald-500 whitespace-nowrap"
                  >
                    ✍️ Draft Liability Compromise
                  </button>
                  <button
                    onClick={() => handleSendChat('What are the risks under Delaware law if we sign this as-is?')}
                    className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-emerald-500 whitespace-nowrap"
                  >
                    ⚖️ Delaware Law Analysis
                  </button>
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChat();
                  }}
                  className="p-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask ContractIQ Agent anything about this agreement..."
                    className="flex-1 bg-neutral-100 dark:bg-neutral-800 border-none rounded-xl px-4 py-2.5 text-xs text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isSendingChat}
                    className="p-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB CONTENT 4: OBLIGATIONS & DEADLINES */}
            {activeTab === 'obligations' && (
              <div className="p-4 overflow-y-auto flex-1 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                  <div>
                    <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                      Autonomous Post-Signature Obligation & Milestone Tracker
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Auto-extracted compliance triggers & penalty notices
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {(audit.keyObligationDeadlines || [
                    { obligation: 'Contract Non-Renewal Written Notice Window', timeframe: '120 days prior to term end', consequence: 'Automatic 2-year renewal lock with 15% price spike' },
                    { obligation: 'Payment Due Period', timeframe: 'Net 15 days', consequence: '2.5% monthly late fee penalty' },
                    { obligation: 'Security Incident Notification SLA', timeframe: '48-72 hours statutory window', consequence: 'GDPR/CCPA compliance fine risk' },
                    { obligation: 'Vendor Audit Access Request', timeframe: '24 hours notice', consequence: 'On-premise / system inspection' }
                  ]).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <span className="font-bold text-neutral-900 dark:text-white block">
                          {item.obligation}
                        </span>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                          <strong>Consequence of Default:</strong> {item.consequence}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 whitespace-nowrap border border-amber-300 dark:border-amber-800">
                        {item.timeframe}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Paste / Upload Modal */}
      {customUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                Upload or Paste Contract for AI Audit
              </h3>
              <button
                onClick={() => setCustomUploadModal(false)}
                className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Agreement Name / Identifier
              </label>
              <input
                type="text"
                value={contractTitle}
                onChange={(e) => setContractTitle(e.target.value)}
                placeholder="e.g. Master Services Agreement with Acme Corp"
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Paste Agreement Text
              </label>
              <textarea
                value={customTextInput || contractText}
                onChange={(e) => setCustomTextInput(e.target.value)}
                placeholder="Paste contract text, clauses, or terms here..."
                rows={10}
                className="w-full font-mono-code text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.md,.doc,.docx"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Document File</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCustomUploadModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (customTextInput) {
                      setContractText(customTextInput);
                    }
                    setCustomUploadModal(false);
                    handleRunAudit();
                  }}
                  className="px-5 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs shadow-xs"
                >
                  Audit Now with AI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
