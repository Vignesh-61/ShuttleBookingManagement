import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Feedback.css';

const Feedback = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        rating: '5',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/feedback', formData);
            alert('Thank you for your feedback! It helps us improve.');
            navigate('/');
        } catch (err) {
            alert('Failed to submit feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="feedback-page">
            <div className="feedback-content">
                <div className="feedback-header">
                    <h1>We Value Your Voice</h1>
                    <p>Share your experience with Smart Shuttle and help us make every journey better.</p>
                </div>

                <div className="feedback-card">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Overall Experience</label>
                            <div className="rating-select">
                                <select
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleChange}
                                >
                                    <option value="5">⭐⭐⭐⭐⭐ - Premium Service</option>
                                    <option value="4">⭐⭐⭐⭐ - Great Journey</option>
                                    <option value="3">⭐⭐⭐ - Satisfactory</option>
                                    <option value="2">⭐⭐ - Could be Better</option>
                                    <option value="1">⭐ - Poor Experience</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="5"
                                placeholder="Tell us what you liked or how we can improve..."
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="feedback-submit-btn" disabled={loading}>
                            {loading ? 'Submitting...' : 'Send Feedback'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
