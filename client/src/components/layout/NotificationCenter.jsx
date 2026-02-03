import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import './NotificationCenter.css';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await axios.get('http://localhost:5000/api/notifications', {
                headers: { 'x-auth-token': token }
            });
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.isRead).length);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
                headers: { 'x-auth-token': token }
            });
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    const deleteNotification = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/notifications/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setNotifications(notifications.filter(n => n._id !== id));
            const wasUnread = notifications.find(n => n._id === id)?.isRead === false;
            if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Error deleting notification:', err);
        }
    };

    return (
        <div className="notification-center">
            <button className="notification-bell" onClick={() => setIsOpen(!isOpen)}>
                <Bell size={20} className={unreadCount > 0 ? "bell-active" : "bell-inactive"} />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>


            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>
                            <X size={18} />
                        </button>
                    </div>
                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="no-notifications">No notifications found</div>
                        ) : (
                            notifications.map(n => (
                                <div key={n._id} className={`notification-item ${n.isRead ? 'read' : 'unread'}`}>
                                    <div className="notification-content">
                                        <div className="notification-title">{n.title}</div>
                                        <div className="notification-message">{n.message}</div>
                                        <div className="notification-time">
                                            {new Date(n.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="notification-actions">
                                        {!n.isRead && (
                                            <button className="mark-read-btn" onClick={() => markAsRead(n._id)} title="Mark as read">
                                                <Check size={16} />
                                            </button>
                                        )}
                                        <button className="delete-btn" onClick={() => deleteNotification(n._id)} title="Delete">
                                            <Trash2 size={16} />
                                        </button>
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

export default NotificationCenter;
