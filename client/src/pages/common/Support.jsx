import React from 'react';
import Chatbot from '../../components/common/Chatbot';
import './Support.css';

const Support = () => {

    return (
        <div className="support-page">
            <div className="support-container">
                <header className="support-header">
                    <h1 className="support-title">Here to Help</h1>
                    <p className="support-subtitle">
                        Have questions or need assistance? Our dedicated support team is available 24/7 to ensure your journey is smooth and hassle-free.
                    </p>
                </header>

                <div className="support-grid">
                    <div className="contact-card">
                        <h2 className="card-title">Contact Us</h2>
                        <div className="contact-methods">
                            <div className="method">
                                <h2 className="card-title">MOBILE NO</h2>
                                <h2 className="card-title">+91 9876543210</h2>
                            </div>
                            <div className="method">
                                <h2 className="card-title">EMAIL</h2>
                                <h2 className="card-title">kit28@gmail.com</h2>
                            </div>
                        </div>
                    </div>

                    <div className="chatbot-card">
                        <h2 className="card-title">Immediate Help</h2>
                        <Chatbot />
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Support;