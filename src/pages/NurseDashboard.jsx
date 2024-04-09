import React, { useState } from 'react';
import { useParams } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auths/AuthContext';
import { GET_USER } from '../graphql/queries/user.query';

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
    const medikaLogo = '/medika.png'
    const [searchQuery, setSearchQuery] = useState('');
    const { nurseId } = useParams();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const { loading, error, data } = useQuery(GET_USERS);
       // Apollo query
   const { loading: loadingUser, error: errorUser, data: userData } = useQuery(GET_USER, {
    variables: { id:  nurseId },
  });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const users = data && data.users ? data.users : [];

    // Filter out only patient users 
    // TODO on backend
    const patientUsers = users.filter(user => user.role === 'patient')
    // original was users.filter
    const filteredUsers = patientUsers.filter(user =>
        (user.name ? user.name.toLowerCase() : "").includes(searchQuery.toLowerCase())
    );

    if (loadingUser) return <div>Loading...</div>;
    if ( errorUser) return <div>Error loading data</div>;

    const user = userData?.user;
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
    <div className="min-h-screen bg-gray-100">
  {/* Header Section */}
  <div className="flex justify-between items-center py-4 px-6 bg-white shadow-md">
  <img src={medikaLogo} alt="Medika Logo" className="w-30 h-20" />

  <h3 className="text-lg leading-6 font-medium text-gray-900 text-center flex-grow">
    Welcome Nurse: {user?.name || 'Nurse'}
  </h3>

  <button onClick={handleLogout} className="text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 px-3 py-1 rounded-md">
    Logout
  </button>
</div>


  {/* Search Input */}
  <div className="flex justify-center mt-6">
    <input
      type="text"
      placeholder="Search by username"
      onChange={(e) => setSearchQuery(e.target.value)}
      className="max-w-lg w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300"
    />
  </div>

  {/* Users Table */}
  <div className="mt-6 max-w-6xl mx-auto">
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
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
          {/* Table Body */}
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
</div>

  )
}

export default NurseDashboard