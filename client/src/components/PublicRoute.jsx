import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="text-white p-10">Loading...</div>;
    }

    return user ? <Navigate to="/profile" /> : children;
};

export default PublicRoute;
