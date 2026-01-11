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
        <div className="flex flex-col h-[700px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center bg-gradient-to-r from-gray-50 to-white">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-sm">AI Legal Companion</h3>
                    <p className="text-xs text-gray-500">Ask detailed questions about this contract</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50/30">
                {messages.map((msg, idx) => (
                    <div key={idx} className={cn("flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300", msg.role === 'user' ? "justify-end" : "justify-start")}>
                        <div className={cn(
                            "max-w-[85%] rounded-2xl p-4 shadow-sm",
                            msg.role === 'user'
                                ? "bg-blue-600 text-white rounded-tr-sm"
                                : "bg-white text-gray-800 rounded-tl-sm border border-gray-100"
                        )}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                            {/* Citations */}
                            {msg.citations && msg.citations.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-gray-100/20">
                                    <p className={cn("text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center opacity-70", msg.role === 'user' ? 'text-blue-100' : 'text-gray-400')}>
                                        <BookOpen className="w-3 h-3 mr-1.5" /> Source Evidence
                                    </p>
                                    <div className="space-y-2">
                                        {msg.citations.map((cite, cIdx) => (
                                            <div key={cIdx} className={cn("p-2.5 rounded-lg text-xs", msg.role === 'user' ? "bg-white/10" : "bg-gray-50 border border-gray-100")}>
                                                <p className="italic opacity-90 mb-1.5">"{cite.clause_text}"</p>
                                                <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wide", msg.role === 'user' ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600")}>
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
                        <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your legal question..."
                        className="w-full pl-5 pr-12 py-3.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm placeholder:text-gray-400"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-center mt-2">
                    <span className="text-[10px] text-gray-400">AI can make mistakes. Verify important info.</span>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;
