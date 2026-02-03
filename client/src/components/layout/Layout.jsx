import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

const Layout = () => {
    const { user } = useAuth();

    return (
        <div className="layout-container">
            <Navbar />
            <div className="layout-main-section">
                {user && <Sidebar />}
                <main className={`layout-content ${user ? 'with-sidebar' : ''}`}>
                    <Outlet />
                </main>
            </div>
            {!user && <Footer />}
        </div>
    );
};

export default Layout;
