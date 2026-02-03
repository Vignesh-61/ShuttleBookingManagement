import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './PassengerDashboard.css';

const PassengerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ bookings: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/bookings/passenger/${user.id}`);
                setStats({ bookings: res.data.length });
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user]);

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Welcome, {user?.name}</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Bookings</h3>
                        <p className="stat-number">{stats.bookings}</p>
                    </div>
                </div>
            )}

            <div className="info-section">
                <h2>Your Dashboard</h2>
                <p>Use the menu on the left to navigate:</p>
                <ul>
                    <li><strong>Find Shuttle</strong> - Search and book available shuttles</li>
                    <li><strong>My Bookings</strong> - View your booking history</li>
                </ul>
            </div>
        </div>
    );
};

export default PassengerDashboard;
