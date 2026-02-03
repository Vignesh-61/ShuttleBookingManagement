import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VehicleSchedule.css';

const VehicleSchedule = () => {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState('');
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
    const [scheduleData, setScheduleData] = useState({}); // Map: 'YYYY-MM-DD' -> bookedCount
    const [totalSeats, setTotalSeats] = useState(0);
    const [loading, setLoading] = useState(false);
    const [vehicleLoading, setVehicleLoading] = useState(true);

    // Fetch owner's vehicles for dropdown
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const res = await axios.get('http://localhost:5000/api/shuttles/my-shuttles', {
                    headers: { 'x-auth-token': token }
                });
                setVehicles(res.data);
                if (res.data.length > 0) {
                    setSelectedVehicleId(res.data[0]._id);
                }
                setVehicleLoading(false);
            } catch (err) {
                console.error('Error fetching vehicles:', err);
                setVehicleLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    // Fetch schedule when vehicle or week changes
    useEffect(() => {
        if (!selectedVehicleId) return;

        const fetchSchedule = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');

                // Calculate week range
                const start = new Date(currentWeekStart);
                const end = new Date(currentWeekStart);
                end.setDate(end.getDate() + 6);

                const res = await axios.get(`http://localhost:5000/api/shuttles/${selectedVehicleId}/schedule`, {
                    headers: { 'x-auth-token': token },
                    params: {
                        startDate: start.toISOString(),
                        endDate: end.toISOString()
                    }
                });

                setScheduleData(res.data.schedule);
                setTotalSeats(res.data.shuttle.totalSeats);
                // We might also want departure/arrival times from res.data.shuttle if needed to display
                setLoading(false);
            } catch (err) {
                console.error('Error fetching schedule:', err);
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [selectedVehicleId, currentWeekStart]);

    // Helper to change week
    const changeWeek = (offset) => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() + (offset * 7));
        setCurrentWeekStart(newStart);
    };

    // Helper to generate the 7 days array
    const getDaysArray = () => {
        const days = [];
        let current = new Date(currentWeekStart);
        for (let i = 0; i < 7; i++) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return days;
    };

    // Helper to format date key
    const formatDateKey = (date) => {
        return date.toISOString().split('T')[0];
    };

    const days = getDaysArray();
    const selectedVehicle = vehicles.find(v => v._id === selectedVehicleId);

    return (
        <div className="schedule-container">
            <header className="schedule-header">
                <h1>Vehicle Schedule</h1>
                <div className="vehicle-selector">
                    {vehicleLoading ? (
                        <span>Loading vehicles...</span>
                    ) : (
                        <select
                            value={selectedVehicleId}
                            onChange={(e) => setSelectedVehicleId(e.target.value)}
                        >
                            {vehicles.map(v => (
                                <option key={v._id} value={v._id}>
                                    {v.vehicleName} ({v.vehicleNumber})
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </header>

            {!selectedVehicleId && !vehicleLoading && (
                <div className="empty-select-state">
                    Please select or add a vehicle to view its schedule.
                </div>
            )}

            {selectedVehicleId && (
                <>
                    <div className="week-navigation">
                        <button className="nav-btn" onClick={() => changeWeek(-1)}>← Prev Week</button>
                        <span className="week-range">
                            {days[0].toLocaleDateString()} - {days[6].toLocaleDateString()}
                        </span>
                        <button className="nav-btn" onClick={() => changeWeek(1)}>Next Week →</button>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading schedule...</div>
                    ) : (
                        <div className="schedule-grid">
                            {days.map((date, index) => {
                                const dateKey = formatDateKey(date);
                                const booked = scheduleData[dateKey] || 0;
                                const percentage = Math.min((booked / totalSeats) * 100, 100);
                                const isToday = formatDateKey(new Date()) === dateKey;

                                let progressClass = 'progress-fill';
                                if (percentage >= 100) progressClass += ' full';
                                else if (percentage >= 75) progressClass += ' warning';

                                return (
                                    <div key={index} className={`day-card ${isToday ? 'today' : ''}`}>
                                        <div className="day-name">
                                            {date.toLocaleDateString('en-US', { weekday: 'long' })}
                                        </div>
                                        <div className="date-header">
                                            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>

                                        {selectedVehicle && (
                                            <div className="time-info">
                                                {selectedVehicle.departureTime} ➔ {selectedVehicle.arrivalTime}
                                            </div>
                                        )}

                                        <div className="occupancy-info">
                                            <div className="occupancy-label">
                                                {booked >= totalSeats ? 'Full' : 'Available'}
                                            </div>
                                            <div className="progress-bar">
                                                <div
                                                    className={progressClass}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <div className="seats-count">
                                                {booked} / {totalSeats} Booked
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default VehicleSchedule;
