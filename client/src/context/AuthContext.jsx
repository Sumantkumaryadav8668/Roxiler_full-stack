import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                    setToken(storedToken);
                    
                    const res = await authAPI.getProfile();
                    if (res.success && res.data) {
                        setUser(res.data);
                        localStorage.setItem('user', JSON.stringify(res.data));
                    }
                } catch (err) {
                    
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                    setToken(null);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    
    const login = async (email, password) => {
        const res = await authAPI.login({ email, password });
        if (res.success && res.data) {
            const { token: authToken, user: userData } = res.data;
            setToken(authToken);
            setUser(userData);
            localStorage.setItem('token', authToken);
            localStorage.setItem('user', JSON.stringify(userData));
        }
        return res;
    };

    
    const signup = async (userData) => {
        const res = await authAPI.signup(userData);
        if (res.success && res.data) {
            const { token: authToken, user: newUser } = res.data;
            setToken(authToken);
            setUser(newUser);
            localStorage.setItem('token', authToken);
            localStorage.setItem('user', JSON.stringify(newUser));
        }
        return res;
    };

    
    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (err) {
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setToken(null);
        }
    };

    
    const changePassword = async (currentPassword, newPassword) => {
        return await authAPI.changePassword({ currentPassword, newPassword });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                signup,
                logout,
                changePassword,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
