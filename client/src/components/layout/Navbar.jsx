import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';


const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };


    return (
        <header className="site-header">
            <div className="nav-logo">
                <Link to="/">Smart Shuttle Booking System</Link>
            </div>
            <div className="nav-right">
                <div className="nav-actions">
                    {isAuthenticated ? (
                        <>
                            <button className="btn-signin" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <button className="btn-signup" onClick={() => navigate('/register')}>Sign Up</button>
                            <button className="btn-signin" onClick={handleLoginClick}>Sign In</button>
                        </>
                    )}
                </div>

                <nav className="nav-menu">
                    <Link to="/support">Support</Link>
                    <span className="separator">|</span>
                    <Link to="/feedback">Feedback</Link>
                    <span className="separator">|</span>
                    <Link to="/about">About Us</Link>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
