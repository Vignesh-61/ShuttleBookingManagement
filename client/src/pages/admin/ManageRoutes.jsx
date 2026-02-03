import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageRoutes.css';

const ManageRoutes = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:5000/api/shuttles');
                setRoutes(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching routes:', err);
                setError('Failed to load routes from database');
                setLoading(false);
            }
        };

        fetchRoutes();
    }, []);

    return (
        <div className="manage-routes-container">
            <header className="manage-header">
                <h1>Manage Active Routes</h1>
                <div className="route-counter">
                    Total Active: {routes.length}
                </div>
            </header>

            {loading ? (
                <div className="loading-container">
                    <p>Fetching active routes from database...</p>
                </div>
            ) : error ? (
                <div className="error-container">
                    <p>{error}</p>
                </div>
            ) : (
                <div className="routes-content">
                    <div className="routes-grid">
                        {routes.length === 0 ? (
                            <div className="no-data">No active routes found in database.</div>
                        ) : (
                            routes.map(route => (
                                <div key={route._id} className="route-card">
                                    <div className="card-top">
                                        <h3 className="route-title">{route.from} → {route.to}</h3>
                                        <span className="status-badge status-active">{route.status}</span>
                                    </div>

                                    <div className="card-details">
                                        <div className="detail-item">
                                            <span className="detail-label">Vehicle</span>
                                            <span className="detail-value">{route.vehicleName}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Number</span>
                                            <span className="detail-value">{route.vehicleNumber}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Departure</span>
                                            <span className="detail-value">{route.departureTime}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Arrival</span>
                                            <span className="detail-value">{route.arrivalTime}</span>
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <div className="seat-indicator">
                                            <div className={`seat-dot ${route.availableSeats < 5 ? 'low' : ''}`}></div>
                                            <span>{route.availableSeats} / {route.totalSeats} seats</span>
                                        </div>
                                        <div className="price-tag">₹{route.price}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageRoutes;
