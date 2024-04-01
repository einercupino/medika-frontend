import React, { useState } from 'react'
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { REGISTER_USER } from '../graphql/mutations/user.mutation';

const PatientRegister = () => {
    const [role] = useState('patient')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const navigate = useNavigate()

    // use gql mutation
    const [registerUser, { data, loading, error }] = useMutation(REGISTER_USER);

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
          const response = await registerUser({
              variables: { email, password, name, role }
          });
          console.log('Registration successful', response.data);
          navigate('/login');
          // Redirect or show success message
      } catch (error) {
          console.error('Registration error:', error.message);
          // Handle registration error (e.g., show error message)
      }
    }
  
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
         <form
           onSubmit={handleRegister}
           className="max-w-md w-full mx-auto bg-white p-8 border border-gray-300 rounded-lg"
         >
           <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">Patient Register</h2>
   
           <div className="mb-4">
             <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
             <input
               type="email"
               id="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               placeholder="Email"
               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
               required
             />
           </div>
   
           <div className="mb-4">
             <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
             <input
               type="text"
               id="name"
               value={name}
               onChange={(e) => setName(e.target.value)}
               placeholder="Name"
               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
               required
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
               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
               required
             />
           </div>
   
           <button
             type="submit"
             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
           >
             Register
           </button>
         </form>
       </div>
     )
     
}

export default PatientRegister