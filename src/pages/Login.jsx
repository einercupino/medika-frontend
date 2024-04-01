import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LOGIN_USER } from '../graphql/mutations/user.mutation';
import { GET_USER_BY_EMAIL } from '../graphql/queries/user.query'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [loginUser, { loading: loadingLogin, error: errorLogin }] = useMutation(LOGIN_USER);
    const { loading: loadingUser, error: errorUser, data: userData } = useQuery(GET_USER_BY_EMAIL, {
        variables: { email },
        skip: !email, // Skip this query until we have the email after login
    });

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const { data: loginData } = await loginUser({ variables: { email, password } });
            console.log(loginData);  // You should get the token here
            
            // If login is successful, userData will now be populated with the user's information
            if (!loadingUser && userData && userData.userByEmail) {
                // Redirect based on the user's role
                if (userData.userByEmail.role === 'nurse') {
                    navigate(`/nurse/dashboard/${userData.userByEmail.id}`);
                } else if (userData.userByEmail.role === 'patient') {
                    navigate(`/patient/dashboard/${userData.userByEmail.id}`);
                }
            }
        } catch (error) {
            console.error('Login error:', error.message);
            // Handle login error (e.g., show an error message)
        }
    };

    // Display error messages if any
    let errorMessage = '';
    if (errorLogin) errorMessage = errorLogin.message;
    if (errorUser) errorMessage = errorUser.message;

    return (
        <form onSubmit={handleLogin} className="max-w-sm mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Medika Login</h2>
        
        <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
        </div>

        <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
        </div>

            {errorMessage && <p className="text-red-500 text-xs italic">{errorMessage}</p>}
            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                disabled={loadingLogin || loadingUser}
            >
                Login
            </button>
        </form>
    );
};

export default Login;
