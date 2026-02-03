import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageUsers.css';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/auth/users', {
                    headers: { 'x-auth-token': token }
                });
                setUsers(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError(err.response?.data?.msg || 'Failed to load users from database');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const getRoleClass = (role) => {
        switch (role) {
            case 'ADMIN': return 'role-admin';
            case 'OWNER': return 'role-owner';
            default: return 'role-passenger';
        }
    };

    return (
        <div className="manage-users-container">
            <header className="manage-header">
                <h1>Manage Users</h1>
                <div className="user-counter">
                    Total Registered: {users.length}
                </div>
            </header>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Accessing secure user database...</p>
                </div>
            ) : error ? (
                <div className="error-container">
                    <p className="error-text">{error}</p>
                    <button onClick={() => window.location.reload()} className="retry-btn">Retry</button>
                </div>
            ) : (
                <div className="users-list-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>User Info</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Joined Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}>
                                        No users found in the system.
                                    </td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user._id}>
                                        <td>
                                            <div className="user-info">
                                                <span className="user-name">{user.name}</span>
                                                <span className="user-email">{user.email}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`role-badge ${getRoleClass(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="status-indicator">
                                                <div className="status-dot"></div>
                                                <span className="status-text">Active</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="date-text">
                                                {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
