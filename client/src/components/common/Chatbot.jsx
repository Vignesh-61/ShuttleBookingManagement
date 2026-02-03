import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { text: "Hello! Welcome to Shuttle Service. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const responses = {
        "hello": "Hi there! How can I assist you with your shuttle booking today?",
        "hi": "Hello! Need help finding a shuttle?",
        "book": "You can find shuttles in the 'Search Shuttles' section. Just enter your pickup and drop locations!",
        "price": "Our shuttle prices vary by distance, typically ranging from ₹50 to ₹500.",
        "route": "We cover major routes across the city. You can search for specific routes on our search page.",
        "driver": "All our drivers are verified and professional to ensure your safety.",
        "seat": "You can select the number of seats during the booking process.",
        "payment": "We currently support cash and online payments after the ride.",
        "contact": "You can reach our support team at support@shuttlego.com or call +91 9876543210.",
        "help": "I can help you with bookings, routes, pricing, and support information. Just ask!",
        "default": "I'm sorry, I didn't quite understand that. Could you please rephrase or contact support for detailed queries?"
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getBotResponse = (userInput) => {
        const input = userInput.toLowerCase();
        for (const key in responses) {
            if (input.includes(key)) {
                return responses[key];
            }
        }
        return responses["default"];
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, isBot: false };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        setTimeout(() => {
            const botMessage = { text: getBotResponse(currentInput), isBot: true };
            setMessages(prev => [...prev, botMessage]);
            setIsLoading(false);
        }, 600);
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h3> ShuttleBot Assistant</h3>
            </div>
            <div className="chatbot-messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                        <div className="message-bubble">
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="message bot">
                        <div className="message-bubble typing">
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form className="chatbot-input" onSubmit={handleSend}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit" disabled={!input.trim()}>
                    ask
                </button>
            </form>
        </div>
    );
};

export default Chatbot;
