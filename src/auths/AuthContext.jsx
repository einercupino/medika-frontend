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

    // Now, every time the app loads, this effect will run and set the auth state from local storage
    React.useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (token && role) {
            setAuthState({ token, role });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ ...authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
