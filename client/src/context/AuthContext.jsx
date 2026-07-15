import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await api.get('/profile');
            setUser(res.data.user);
            return res.data.user;
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/login', { email, password });
        setUser(res.data.user);
        return res.data;
    };

    const register = async (userData) => {
        const res = await api.post('/register', userData);
        setUser(res.data.user);
        return res.data;
    };

    const logout = async () => {
        await api.get('/logout');
        setUser(null);
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
