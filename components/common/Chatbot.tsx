
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { getChatResponse } from '../../services/geminiService';
import { ChatMessage } from '../../types';
import { useData } from '../../context/DataContext';

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { products } = useData();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    useEffect(() => {
        if(isOpen && messages.length === 0) {
            setMessages([
                { sender: 'bot', text: 'Hello! I am your STAY RAW assistant. How can I help you today? Feel free to ask about our products!' }
            ]);
        }
    }, [isOpen, messages.length]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const trimmedInput = input.trim();
        if (!trimmedInput) return;

        const userMessage: ChatMessage = { sender: 'user', text: trimmedInput };
        setMessages(prev => [...prev, userMessage, { sender: 'bot', text: '', isLoading: true }]);
        setInput('');

        const response = await getChatResponse(trimmedInput, products);
        
        setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.isLoading) {
                lastMessage.text = response;
                lastMessage.isLoading = false;
            }
            return newMessages;
        });
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-20 md:bottom-6 right-6 bg-amber-400 text-gray-900 w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-3xl hover:bg-amber-500 transition-transform transform hover:scale-110 z-50"
                aria-label="Toggle Chatbot"
            >
                <i className={`fas ${isOpen ? 'fa-times' : 'fa-comments'}`}></i>
            </button>

            {isOpen && (
                <div className="fixed bottom-40 md:bottom-24 right-6 w-80 h-[450px] bg-white rounded-xl shadow-2xl flex flex-col z-50 animate-fade-in-up">
                    <header className="bg-gray-900 text-white p-4 rounded-t-xl">
                        <h3 className="font-bold text-lg">STAY RAW Support</h3>
                    </header>
                    <main className="flex-1 p-4 overflow-y-auto bg-gray-50">
                        <div className="space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-3 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-amber-400 text-black' : 'bg-gray-200 text-gray-800'}`}>
                                        {msg.isLoading ? (
                                            <div className="flex items-center space-x-1">
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                                            </div>
                                        ) : (
                                            <p dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div ref={messagesEndRef} />
                    </main>
                    <footer className="p-2 border-t">
                        <form onSubmit={handleSubmit} className="flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about products..."
                                className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                            />
                            <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-r-md font-semibold hover:bg-black">
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </form>
                    </footer>
                </div>
            )}
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
};

export default Chatbot;
