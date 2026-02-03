import React, { useState, useEffect, useCallback } from 'react';

import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import OTPVerification from '../../components/common/OTPVerification';
import './SearchShuttles.css';

const SearchShuttles = () => {
    const { user } = useAuth();
    const [shuttles, setShuttles] = useState([]);
    const [searchFrom, setSearchFrom] = useState('');
    const [searchTo, setSearchTo] = useState('');
    const [loading, setLoading] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // OTP State
    const [showOTP, setShowOTP] = useState(false);
    const [pendingShuttleId, setPendingShuttleId] = useState(null);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleSearch = (e) => {
        e.preventDefault();
        fetchShuttles();
    };

    const handleBook = async (shuttleId) => {
        if (!user) return alert('Please login to book a shuttle');

        setPendingShuttleId(shuttleId);
        setMessage({ type: '', text: '' });

        // Trigger OTP first
        try {
            await axios.post('http://localhost:5000/api/auth/send-otp', { email: user.email });
            setShowOTP(true);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to send verification code. Please try again.' });
        }
    };

    const finalizeBooking = async () => {
        setBookingLoading(true);
        setShowOTP(false);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/bookings', {
                shuttleId: pendingShuttleId,
                seatsBooked: 1
            }, {
                headers: { 'x-auth-token': token }
            });
            setMessage({ type: 'success', text: 'Identity Verified & Booking confirmed! Check your notification bell.' });

            fetchShuttles(); // Refresh list to update seat count
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.msg || 'Booking failed' });
        } finally {
            setBookingLoading(false);
            setPendingShuttleId(null);
        }
    };

    return (
        <div className="search-view">
            <h1 className="view-title">Find a Shuttle</h1>
            {showOTP && (
                <OTPVerification
                    email={user.email}
                    onVerified={finalizeBooking}
                    onCancel={() => setShowOTP(false)}
                    buttonLabel="Verify & Book Now"
                />
            )}

            {message.text && (
                <div className={`message-alert ${message.type}`}>
                    {message.text}
                </div>
            )}

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
                                    <td className="table-cell font-medium">
                                        <div className="shuttle-info-cell">
                                            {s.images && s.images[0] && (
                                                <img src={s.images[0]} alt="" className="shuttle-thumb" />
                                            )}
                                            <div>
                                                <div>{s.vehicleName}</div>
                                                <div className="text-xs text-slate-500">{s.vehicleNumber}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-cell route-text">
                                        <div>{s.from} → {s.to}</div>
                                        <div className="text-xs text-slate-400">Driver: {s.driverName}</div>
                                    </td>
                                    <td className="table-cell">{s.departureTime}</td>
                                    <td className="table-cell">₹{s.price}</td>
                                    <td className="table-cell">
                                        <span className={`seats-badge ${s.availableSeats < 5 ? 'low' : ''}`}>
                                            {s.availableSeats} left
                                        </span>
                                    </td>
                                    <td className="table-cell">
                                        <button
                                            className="book-btn"
                                            onClick={() => handleBook(s._id)}
                                            disabled={bookingLoading || s.availableSeats === 0}
                                        >
                                            {s.availableSeats === 0 ? 'Full' : 'Book Now'}
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
export default SearchShuttles;
