import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Correct the path if needed
import ErrorPage from './ErrorPage'; // Correct the path if needed

const NurseRoute = ({ children }) => {
    const { role } = useAuth();
    if (role !== 'nurse') {
        // Redirect to the error page with a custom message
        return <ErrorPage message="You must be a nurse to access this page." />;
    }

    return children;
    //return role === 'nurse' ? children : <Navigate to="/login" replace />;
};

export default NurseRoute;
