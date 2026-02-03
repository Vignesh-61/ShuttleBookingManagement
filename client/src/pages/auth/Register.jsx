import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import OTPVerification from '../../components/common/OTPVerification';
import './Register.css';


const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'PASSENGER' 
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showOtp, setShowOtp] = useState(false);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/auth/send-otp', { email: formData.email });
            setShowOtp(true);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const onOtpVerified = async () => {
        setLoading(true);
        setShowOtp(false);
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="register-container">
            <h1 className="register-title">Smart Shuttle Booking System</h1>

            <div className="register-card">
                <h2 className="card-header">Create Account</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleRegister} className="register-form">
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Mobile Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="+91 9876543210"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">I am a...</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="PASSENGER">Passenger</option>
                            <option value="OWNER">Vehicle Owner</option>
                        </select>
                    </div>

                    <button type="submit" disabled={loading} className="register-btn">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="login-prompt">
                    Already have an account?{' '}
                    <Link to="/login" className="login-link">
                        Login here
                    </Link>
                </div>
            </div>

            {showOtp && (
                <OTPVerification
                    email={formData.email}
                    onVerified={onOtpVerified}
                    onCancel={() => setShowOtp(false)}
                />
            )}
        </div>

    );
};

export default Register;
