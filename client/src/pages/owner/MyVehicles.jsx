import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyVehicles.css';

const MyVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        vehicleName: '',
        vehicleNumber: '',
        from: '',
        to: '',
        departureTime: '',
        arrivalTime: '',
        price: '',
        totalSeats: '',
        driverName: '',
        driverContact: '',
        imageUrl: ''
    });

    const fetchMyVehicles = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/shuttles/my-shuttles', {
                headers: { 'x-auth-token': token }
            });
            setVehicles(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching vehicles:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyVehicles();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const dataToSend = {
                ...formData,
                images: formData.imageUrl ? [formData.imageUrl] : []
            };
            await axios.post('http://localhost:5000/api/shuttles', dataToSend, {
                headers: { 'x-auth-token': token }
            });
            alert('Vehicle added successfully!');
            setShowForm(false);
            setFormData({
                vehicleName: '',
                vehicleNumber: '',
                from: '',
                to: '',
                departureTime: '',
                arrivalTime: '',
                price: '',
                totalSeats: '',
                driverName: '',
                driverContact: '',
                imageUrl: ''
            });
            fetchMyVehicles();
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to add vehicle');
        }
    };

    return (
        <div className="my-vehicles-container">
            <header className="vehicles-header">
                <div>
                    <h1>My Managed Shuttles</h1>
                    <p>Track and manage your vehicle fleet</p>
                </div>
                <button
                    className="add-vehicle-btn"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : '+ Add New Vehicle'}
                </button>
            </header>

            {showForm && (
                <div className="add-vehicle-overlay">
                    <form className="add-vehicle-form" onSubmit={handleSubmit}>
                        <h2>Add Vehicle Information</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Vehicle Name</label>
                                <input name="vehicleName" value={formData.vehicleName} onChange={handleChange} placeholder="e.g. Royal Express" required />
                            </div>
                            <div className="form-group">
                                <label>Vehicle Number</label>
                                <input name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} placeholder="TN-37-AB-1234" required />
                            </div>
                            <div className="form-group">
                                <label>From</label>
                                <input name="from" value={formData.from} onChange={handleChange} placeholder="Pickup City" required />
                            </div>
                            <div className="form-group">
                                <label>To</label>
                                <input name="to" value={formData.to} onChange={handleChange} placeholder="Drop City" required />
                            </div>
                            <div className="form-group">
                                <label>Departure Time</label>
                                <input name="departureTime" value={formData.departureTime} onChange={handleChange} placeholder="08:00 AM" required />
                            </div>
                            <div className="form-group">
                                <label>Arrival Time</label>
                                <input name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} placeholder="01:00 PM" required />
                            </div>
                            <div className="form-group">
                                <label>Ticket Price (₹)</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="450" required />
                            </div>
                            <div className="form-group">
                                <label>Total Seats</label>
                                <input type="number" name="totalSeats" value={formData.totalSeats} onChange={handleChange} placeholder="40" required />
                            </div>
                            <div className="form-group">
                                <label>Driver Name</label>
                                <input name="driverName" value={formData.driverName} onChange={handleChange} placeholder="Driver Full Name" />
                            </div>
                            <div className="form-group">
                                <label>Driver Contact</label>
                                <input name="driverContact" value={formData.driverContact} onChange={handleChange} placeholder="Phone Number" />
                            </div>
                            <div className="form-group full-width">
                                <label>Bus Image URL</label>
                                <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/bus.jpg" />
                            </div>
                        </div>
                        <button type="submit" className="submit-form-btn">Register Vehicle</button>
                    </form>
                </div>
            )}

            <div className="vehicles-grid">
                {loading ? (
                    <p>Loading fleet...</p>
                ) : vehicles.length > 0 ? (
                    vehicles.map(v => (
                        <div key={v._id} className="vehicle-card">
                            <div className="vehicle-image">
                                {v.images && v.images[0] ? (
                                    <img src={v.images[0]} alt={v.vehicleName} />
                                ) : (
                                    <div className="no-image">No Image</div>
                                )}
                            </div>
                            <div className="vehicle-info">
                                <h3>{v.vehicleName}</h3>
                                <p className="vehicle-num">{v.vehicleNumber}</p>
                                <div className="route-info">
                                    <span>{v.from}</span> → <span>{v.to}</span>
                                </div>
                                <div className="extra-details">
                                    <span>Driver: {v.driverName}</span>
                                    <span>Seats: {v.totalSeats}</span>
                                </div>
                                <div className="status-indicator active">
                                    {v.status}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>No vehicles registered yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyVehicles;
