import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Globe, Minimize2, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';

const GlobalChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm your Vault Assistant. Ask me anything across **all your contracts** (e.g., 'Do any contracts expire in 2025?', 'Show me all high-risk liability clauses')." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await api.post('/ask/global', { question: input });
            const botMessage = {
                role: 'assistant',
                content: response.data.answer,
                citations: response.data.citations
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error searching the Vault." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-neutral-900 text-white p-4 rounded-full shadow-lg hover:bg-neutral-800 transition-all z-50 flex items-center space-x-2"
            >
                <Globe className="w-6 h-6" />
                <span className="font-semibold">Ask Vault</span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-line flex flex-col z-50 overflow-hidden font-sans">
            {/* Header */}
            <div className="bg-neutral-900 p-4 flex justify-between items-center text-white">
                <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <h3 className="font-semibold">Vault Intelligence</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-neutral-300 hover:text-white">
                    <Minimize2 className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-paper">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.role === 'user'
                                ? 'bg-accent text-white rounded-br-none'
                                : 'bg-white border border-line text-neutral-800 rounded-bl-none shadow-sm'
                            }`}>
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>

                            {/* Citations */}
                            {msg.citations && msg.citations.length > 0 && (
                                <div className="mt-3 pt-2 border-t border-line">
                                    <p className="text-xs font-bold text-ink-soft mb-1">Sources:</p>
                                    <div className="space-y-1">
                                        {msg.citations.map((cite, i) => (
                                            <div key={i} className="text-xs bg-neutral-100 p-1.5 rounded text-ink-soft truncate">
                                                📄 {cite.source || "Unknown File"}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-line p-3 rounded-2xl rounded-bl-none shadow-sm">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-line">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Search across all contracts..."
                        className="w-full pl-4 pr-10 py-3 bg-neutral-100 border-transparent focus:bg-white focus:border-accent focus:ring-0 rounded-xl text-sm transition-all"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-accent text-white rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GlobalChat;
