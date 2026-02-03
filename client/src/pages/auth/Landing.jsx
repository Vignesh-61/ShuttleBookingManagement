import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./LandingPage.css";
import "../passenger/SearchShuttles.css";

const LandingPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [shuttles, setShuttles] = useState([]);
    const [searchFrom, setSearchFrom] = useState('');
    const [searchTo, setSearchTo] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchShuttles = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/shuttles/search?from=${searchFrom}&to=${searchTo}`);
            setShuttles(res.data);
        } catch (err) {
            console.error('Error fetching shuttles:', err);
        } finally {
            setLoading(false);
        }
    }, [searchFrom, searchTo]);

    useEffect(() => {
        fetchShuttles();
    }, [fetchShuttles]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchShuttles();
    };

    const handleAction = (shuttleId) => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            navigate('/passenger/search');
        }
    };

    return (
        <div className="search-view landing-search">
            <h1 className="view-title">Find a Shuttle</h1>
            <p className="view-subtitle text-center mb-8 text-slate-400">Search and view available shuttles. Login to book your seat.</p>


            <form className="search-bar" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="From (Pickup)"
                    className="search-input"
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="To (Drop)"
                    className="search-input"
                    value={searchTo}
                    onChange={(e) => setSearchTo(e.target.value)}
                />
                <button type="submit" className="search-button" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            <div className="results-table-container">
                <table className="shuttle-table">
                    <thead className="table-head">
                        <tr>
                            <th className="table-header-cell">Shuttle</th>
                            <th className="table-header-cell">Route</th>
                            <th className="table-header-cell">Time</th>
                            <th className="table-header-cell">Price</th>
                            <th className="table-header-cell">Seats</th>
                            <th className="table-header-cell">Action</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {shuttles.length > 0 ? (
                            shuttles.map((s) => (
                                <tr key={s._id} className="table-row">
                                    <td className="table-cell font-medium">{s.vehicleName}</td>
                                    <td className="table-cell route-text">{s.from} → {s.to}</td>
                                    <td className="table-cell">{s.departureTime}</td>
                                    <td className="table-cell">₹{s.price}</td>
                                    <td className="table-cell">
                                        <span className={`seats-badge ${s.availableSeats < 5 ? 'low' : ''}`}>
                                            {s.availableSeats} left
                                        </span>
                                    </td>
                                    <td className="table-cell">
                                        <button
                                            className={`book-btn ${!isAuthenticated ? 'login-req' : ''}`}
                                            onClick={() => handleAction(s._id)}
                                            disabled={s.availableSeats === 0}
                                        >
                                            {s.availableSeats === 0 ? 'Full' : (isAuthenticated ? 'View/Book' : 'Login to Book')}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="table-cell text-center py-8">
                                    {loading ? 'Loading shuttles...' : 'No shuttles found for this route.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LandingPage;
