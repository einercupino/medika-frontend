import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auths/AuthContext';

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      username
      name
      role
    }
  }
`;

const NurseDashboard = () => {
    //const [users, setUsers] = useState([]);
    const { loading, error, data } = useQuery(GET_USERS);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { logout } = useAuth();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const users = data && data.users ? data.users : [];

    // Filter out only patient users 
    // TODO on backend
    const patientUsers = users.filter(user => user.role === 'patient')
    // original was users.filter
    const filteredUsers = patientUsers.filter(user =>
        (user.id ? user.id.toLowerCase() : "").includes(searchQuery.toLowerCase())
    );

    const handleDelete = (userId) => {
        // Logic to delete user
        console.log('Deleting user', userId);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleViewVitalSign = (userId, userName) => {
        // Navigate to view vital sign page, get patientId and name
        navigate(`/nurse/vital-signs/${userId}`, { state: { name: userName } });
        console.log('Navigating to vital signs for user', userId, 'Name:', userName);
    };

  return (
    <div className="px-4 py-6">
    <div className="mb-4">
    <button onClick={handleLogout}>Logout</button>
        <input
            type="text"
            placeholder="Search by username"
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300"
        />
    </div>
    <div className="overflow-x-auto rounded-lg">
        <table className="w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                        Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                        Actions
                    </th>

                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                            <button onClick={() => handleDelete(user.id)} className="text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 px-3 py-1 rounded-md">
                                Delete
                            </button>
                            <button onClick={() => handleViewVitalSign(user.id, user.name)} className="text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-2 px-3 py-1 rounded-md">
                                View Vital Signs
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</div>

  )
}

export default NurseDashboard