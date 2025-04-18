// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Beim Laden der Anwendung prüfen, ob ein Token existiert
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    // Token dem API-Client hinzufügen
                    api.setAuthToken(token);

                    // Benutzerinformationen abrufen
                    const response = await api.get('/api/auth/user/');
                    setCurrentUser(response.data);
                    setIsAuthenticated(true);
                } catch (err) {
                    console.error('Auth check failed:', err);
                    // Token ist ungültig oder abgelaufen
                    localStorage.removeItem('auth_token');
                    api.removeAuthToken();
                }
            }
            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    // Login-Funktion
    const login = async (email, password) => {
        setError('');
        try {
            const response = await api.post('/api/auth/login/', { email, password });
            const { token, user } = response.data;

            // Token speichern
            localStorage.setItem('auth_token', token);
            api.setAuthToken(token);

            setCurrentUser(user);
            setIsAuthenticated(true);
            return true;
        } catch (err) {
            console.error('Login failed:', err);
            setError(err.response?.data?.message || 'Login fehlgeschlagen');
            return false;
        }
    };

    // Registrierungs-Funktion
    const register = async (userData) => {
        setError('');
        try {
            const response = await api.post('/api/auth/register/', userData);
            const { token, user } = response.data;

            // Token speichern
            localStorage.setItem('auth_token', token);
            api.setAuthToken(token);

            setCurrentUser(user);
            setIsAuthenticated(true);
            return true;
        } catch (err) {
            console.error('Registration failed:', err);
            setError(err.response?.data?.message || 'Registrierung fehlgeschlagen');
            return false;
        }
    };

    // Logout-Funktion
    const logout = () => {
        localStorage.removeItem('auth_token');
        api.removeAuthToken();
        setCurrentUser(null);
        setIsAuthenticated(false);
    };

    // Prüfen, ob Benutzer Premium-Status hat
    const isPremium = () => {
        return currentUser?.is_premium || false;
    };

    const value = {
        currentUser,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        isPremium
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};