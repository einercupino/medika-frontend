import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Correct the path if needed
import ErrorPage  from './ErrorPage'; // Correct the path if needed

const PatientRoute = ({ children }) => {
    const { role } = useAuth();
    if (role !== 'patient') {
        // Redirect to the error page with a custom message
        return <ErrorPage message="You must be a patient to access this page." />;
    }

    return children;
};

export default PatientRoute;
