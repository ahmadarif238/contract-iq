import React, { useState } from 'react';
import { Send, User, Bot, Sparkles, BookOpen } from 'lucide-react';
import { askQuestion } from '../services/api';
import { cn } from '../lib/utils';

const ChatInterface = ({ contractId }) => {
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hello! I am your contract assistant. Ask me anything about this document.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const data = await askQuestion(contractId, userMsg.content);
            const aiMsg = {
                role: 'ai',
                content: data.answer,
                citations: data.citations || []
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error analyzing that question." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[700px] bg-white rounded-2xl shadow-lg border border-line overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-line flex items-center bg-gradient-to-r from-paper to-white">
                <div className="w-8 h-8 bg-accent-soft rounded-lg flex items-center justify-center mr-3">
                    <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <div>
                    <h3 className="font-bold text-ink text-sm">AI Legal Companion</h3>
                    <p className="text-xs text-ink-soft">Ask detailed questions about this contract</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-paper/30">
                {messages.map((msg, idx) => (
                    <div key={idx} className={cn("flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300", msg.role === 'user' ? "justify-end" : "justify-start")}>
                        <div className={cn(
                            "max-w-[85%] rounded-2xl p-4 shadow-sm",
                            msg.role === 'user'
                                ? "bg-accent text-white rounded-tr-sm"
                                : "bg-white text-neutral-800 rounded-tl-sm border border-line"
                        )}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                            {/* Citations */}
                            {msg.citations && msg.citations.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-line/20">
                                    <p className={cn("text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center opacity-70", msg.role === 'user' ? 'text-accent-soft' : 'text-ink-faint')}>
                                        <BookOpen className="w-3 h-3 mr-1.5" /> Source Evidence
                                    </p>
                                    <div className="space-y-2">
                                        {msg.citations.map((cite, cIdx) => (
                                            <div key={cIdx} className={cn("p-2.5 rounded-lg text-xs", msg.role === 'user' ? "bg-white/10" : "bg-paper border border-line")}>
                                                <p className="italic opacity-90 mb-1.5">"{cite.clause_text}"</p>
                                                <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wide", msg.role === 'user' ? "bg-white/20 text-white" : "bg-neutral-200 text-ink-soft")}>
                                                    {cite.clause_type}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start animate-in fade-in">
                        <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-line shadow-sm flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-line">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your legal question..."
                        className="w-full pl-5 pr-12 py-3.5 bg-paper rounded-xl border border-transparent focus:bg-white focus:border-accent/25 focus:ring-4 focus:ring-accent/20 outline-none transition-all text-sm placeholder:text-ink-faint"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="absolute right-2 p-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-center mt-2">
                    <span className="text-[10px] text-ink-faint">AI can make mistakes. Verify important info.</span>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;
