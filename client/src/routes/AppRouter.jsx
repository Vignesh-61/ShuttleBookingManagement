import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from './ProtectedRoute';

import Login from '../pages/auth/Login';
import Landing from '../pages/auth/Landing';
import Register from '../pages/auth/Register';
import Support from '../pages/common/Support';
import Feedback from '../pages/common/Feedback';
import About from '../pages/common/About';

import PassengerDashboard from '../pages/passenger/PassengerDashboard';
import SearchShuttles from '../pages/passenger/SearchShuttles';

import OwnerDashboard from '../pages/owner/OwnerDashboard';
import MyVehicles from '../pages/owner/MyVehicles';

import ManageUsers from '../pages/admin/ManageUsers';
import ManageRoutes from '../pages/admin/ManageRoutes';

const AppRouter = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/support" element={<Support />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/about" element={<About />} />
                
                <Route element={<ProtectedRoute allowedRoles={['PASSENGER']} />}>
                    <Route path="/passenger/dashboard" element={<PassengerDashboard />} />
                    <Route path="/passenger/search" element={<SearchShuttles />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['OWNER']} />}>
                    <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                    <Route path="/owner/vehicles" element={<MyVehicles />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                    <Route path="/admin/users" element={<ManageUsers />} />
                    <Route path="/admin/routes" element={<ManageRoutes />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;
