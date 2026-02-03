import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} Smart Shuttle System. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
