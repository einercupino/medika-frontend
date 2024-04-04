import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({ login: () => {}, logout: () => {} });

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({ token: null, role: null });

    const login = (token, role) => {
        setAuthState({ token, role });
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
    };

    const logout = () => {
        setAuthState({ token: null, role: null });
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
