import React from 'react'
import { Link } from 'react-router-dom'


const Homepage = () => {
  const medikaLogo = '/medika.png'
  
  return (
    <>
       <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Logo and Title */}
      <div className="flex flex-col items-center mb-8">
        <img src={medikaLogo} alt="Medika Logo" className="w-58 h-48" />
        <h1 className="text-5xl mt-4">Patient Tracking Application</h1>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Patient Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Patient</h2>
          <div className="flex">
            <Link to="/login" className="mr-2">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none">
                Login
              </button>
            </Link>
            <Link to="/patient/register">
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none">
                Register
              </button>
            </Link>
          </div>
        </div>

        {/* Nurse Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Nurse</h2>
          <div className="flex">
            <Link to="/login" className="mr-2">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none">
                Login
              </button>
            </Link>
            <Link to="/nurse/register">
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none">
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