import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        const dashboardMap = {
            PASSENGER: '/passenger/search',
            OWNER: '/owner/vehicles',
            ADMIN: '/admin/users'
        }
        return <Navigate to={dashboardMap[user.role] || '/'} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
