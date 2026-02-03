import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
            try {
                const storedUser = JSON.parse(userStr);
                if (storedUser.role === 'PASSENGER') navigate('/passenger/dashboard');
                else if (storedUser.role === 'OWNER') navigate('/owner/dashboard');
                else if (storedUser.role === 'ADMIN') navigate('/admin/dashboard');
            } catch (err) {
                console.error("Error parsing stored user:", err);
            }
        }
    }, [navigate]);


    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            const data = res.data;

            login(data.user, data.token);

            if (data.user.role === 'PASSENGER') navigate('/passenger/dashboard');
            else if (data.user.role === 'OWNER') navigate('/owner/dashboard');
            else if (data.user.role === 'ADMIN') navigate('/admin/dashboard');

        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h1 className="app-title">ShuttleGo</h1>
            <div className="login-card">
                <h2 className="card-title">Welcome Back</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleLogin} className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="login-btn"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="home-link-container">
                    <button type="button" onClick={() => navigate('/')} className="home-link">
                        Back to Home
                    </button>
                </div>
            </div>
            <div className="register-prompt">
                Don't have an account? <Link to="/register" className="register-link">Register</Link>
            </div>
        </div>
    );
};

export default Login;