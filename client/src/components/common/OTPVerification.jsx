import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OTPVerification.css';

const OTPVerification = ({ email, onVerified, onCancel, buttonLabel = 'Verify & Register' }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);

    useEffect(() => {
        let timer;
        if (resendTimer > 0) {
            timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendTimer]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        if (element.nextSibling && element.value !== '') {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && e.target.previousSibling) {
                e.target.previousSibling.focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:5000/api/auth/verify-otp', {
                email,
                otp: otpString
            });
            onVerified();
        } catch (err) {
            setError(err.response?.data?.msg || 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;

        try {
            await axios.post('http://localhost:5000/api/auth/send-otp', { email });
            setResendTimer(30);
            setError('New OTP sent to your email');
            setOtp(['', '', '', '', '', '']);
        } catch (err) {
            setError('Failed to resend OTP');
        }
    };

    return (
        <div className="otp-overlay">
            <div className="otp-container">
                <h2>Security Verification</h2>
                <p>We've sent a 6-digit code to <strong>{email}</strong></p>

                <form onSubmit={handleSubmit}>
                    <div className="otp-inputs">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={data}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onFocus={(e) => e.target.select()}
                            />
                        ))}
                    </div>

                    {error && <p className={`otp-status ${error.includes('sent') ? 'success' : 'error'}`}>{error}</p>}

                    <button type="submit" className="verify-btn" disabled={isLoading}>
                        {isLoading ? 'Verifying...' : buttonLabel}
                    </button>
                </form>

                <div className="otp-footer">
                    <p>Didn't receive the code?</p>
                    <button
                        className="resend-btn"
                        onClick={handleResend}
                        disabled={resendTimer > 0}
                    >
                        {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                    <button className="cancel-link" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default OTPVerification;
