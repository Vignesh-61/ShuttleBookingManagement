import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    MapPin,
    Bus,
    Calendar,
    Users
} from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import './Sidebar.css';

const Sidebar = () => {
    const { user } = useAuth();

    if (!user) return null;

    const renderNavItems = () => {
        const roles = {
            PASSENGER: [
                { to: "/passenger/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
                { to: "/passenger/search", icon: <MapPin size={20} />, label: "Find Shuttle" },
                { to: "/passenger/bookings", icon: <Bus size={20} />, label: "My Bookings" },
            ],
            OWNER: [
                { to: "/owner/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
                { to: "/owner/vehicles", icon: <Bus size={20} />, label: "My Vehicles" },
                { to: "/owner/bookings", icon: <Calendar size={20} />, label: "Bookings" },
            ],
            ADMIN: [
                { to: "/admin/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
                { to: "/admin/users", icon: <Users size={20} />, label: "Manage Users" },
                { to: "/admin/routes", icon: <MapPin size={20} />, label: "Manage Routes" },
            ]
        };

        const items = roles[user.role] || roles.PASSENGER;

        return items.map((item, index) => (
            <NavItem key={index} {...item} />
        ));
    };

    return (
        <div className="sidebar-container">
            <div className="sidebar-header">
                <div className="header-top">
                    <div>
                        <h2 className="portal-title">Portal</h2>
                        <p className="portal-role">{user.role}</p>
                    </div>
                    <NotificationCenter />
                </div>

                <div className="sidebar-user-card">
                    <p className="user-card-label">Signed in as</p>
                    <p className="user-card-name">{user.name}</p>
                </div>
            </div>

            <nav className="sidebar-nav">
                {renderNavItems()}

            </nav>
        </div>
    );
};

const NavItem = ({ to, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
        }
    >
        {label}
    </NavLink>
);


export default Sidebar;

