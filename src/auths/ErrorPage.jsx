// ErrorPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = ({ message }) => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto bg-white p-8 border border-gray-300 rounded-lg">
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">Error: Not Authorized</h2>
        <p className="mb-4">{message}</p>
        <button
          onClick={goToHome}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
