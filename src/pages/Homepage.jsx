import React from 'react'
import { Link } from 'react-router-dom'

const Homepage = () => {
  
  return (
    <>
       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Patient Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Patient</h2>
          <div>
          <Link to="/login" className="mr-2">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Login
              </button>
            </Link>
            <Link to="/patient/register">
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Register
              </button>
            </Link>
          </div>
        </div>

        {/* User Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Nurse</h2>
          <div>
          <Link to="/login" className="mr-2">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Login
              </button>
            </Link>
            <Link to="/nurse/register">
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Register
              </button>
              </Link>
          </div>
        </div>
      </div>
    </div> 
    </>
  )
}

export default Homepage