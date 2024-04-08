import React, { useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LOGIN_USER } from '../graphql/mutations/user.mutation';
import { GET_USER_BY_EMAIL } from '../graphql/queries/user.query'; 
import { useAuth } from '../auths/AuthContext';

const Login = () => {
    const medikaLogo = '/medika.png'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    console.log("ENV: " + JSON.stringify(import.meta.env.VITE_API_URL))

    const [loginUser, { loading: loadingLogin, error: errorLogin }] = useMutation(LOGIN_USER);
    const [getUserByEmail, { loading: loadingUser, data: userData, error: errorUser }] = useLazyQuery(GET_USER_BY_EMAIL, {
        variables: { email },
        fetchPolicy: 'network-only'  // This ensures the query is made to the server
    });

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const { data: loginData } = await loginUser({ variables: { email, password } });
            if (loginData && loginData.loginUser) {
                const token = loginData.loginUser;
                // Now we call the function returned by useLazyQuery to execute the query
                getUserByEmail();
            }
        } catch (error) {
            console.error('Login error:', error.message);
            // Handle login error (e.g., show an error message)
        }
    };

    // After getting the user data, we perform the role-based redirect
    React.useEffect(() => {
        if (userData && userData.userByEmail) {
            const { id, role } = userData.userByEmail;
            login(id, role); // Save the user ID and role to the auth context
            navigate(`/${role}/dashboard/${id}`);
        }
    }, [userData, navigate, login]);

    // Display error messages if any
    let errorMessage = '';
    if (errorLogin) errorMessage = errorLogin.message;
    if (errorUser) errorMessage = errorUser.message;

    return (
        
        <form onSubmit={handleLogin} className="max-w-sm mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
            {/* Logo and Title */}
      <div className="flex flex-col items-center mb-8">
        <img src={medikaLogo} alt="Medika Logo" className="w-58 h-48" />
      </div>
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
