import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, gql } from '@apollo/client'
import { GET_VITAL_SIGNS_BY_PATIENT } from '../graphql/queries/vitalsign.query'
import { ADD_VITAL_SIGN } from '../graphql/mutations/vitalsign.mutation'
import { GET_USER } from '../graphql/queries/user.query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auths/AuthContext'

const PatientDashboard = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  

  // Apollo query
  const { loading, error, data } = useQuery(GET_VITAL_SIGNS_BY_PATIENT, {
    variables: { patientId },
  });

   // Apollo query
   const { loading: loadingUser, error: errorUser, data: userData } = useQuery(GET_USER, {
    variables: { id:  patientId },
  });
   // Apollo useMutation hook for adding a new vital sign
   const [addVitalSign, { loading: adding, error: addingError }] = useMutation(ADD_VITAL_SIGN, {
    refetchQueries: [
      // After adding, refetch vital signs
      { query: GET_VITAL_SIGNS_BY_PATIENT, variables: { patientId } }
    ],
  });

  // State hooks (always at the top level)
  const [bodyTemperature, setBodyTemperature] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');

  // Conditional rendering should be after all hooks
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (loadingUser) return <div>Loading...</div>;
  if ( errorUser) return <div>Error loading data</div>;

  const vitalSigns = data?.vitalSignsByPatient || [];
  const user = userData?.user;

  const handleGame = (patientId) => {
    navigate(`/patient/game/${patientId}`)
  }

  const handleAssessment = (patientId) => {
    navigate(`/patient/checklist/${patientId}`)
  }

  const handleLogout = () => {
    logout();
    navigate('/');
};


  // Handler for adding a new vital sign
  const handleAddVitalSign = async (e) => {
    e.preventDefault();
    const parsedTemperature = parseFloat(bodyTemperature);
  const parsedHeartRate = parseFloat(heartRate);

    console.log('Attempting to add vital sign with values:', {
        patientId,
        bodyTemperature: parsedTemperature,
        heartRate: parsedHeartRate,
        bloodPressure,
    });
    try {
      await addVitalSign({
        variables: {
          patientId,
          bodyTemperature: parsedTemperature,
          heartRate: parsedHeartRate,
          bloodPressure
        } 
      });
      console.log('Mutation response:', response);
      // Clear the form fields after submission
      setBodyTemperature('');
      setHeartRate('');
      setBloodPressure('');
    } catch (error) {
        if (error.networkError) {
            console.error('Network error:', error.networkError);
          }
        
          if (error.graphQLErrors) {
            error.graphQLErrors.forEach((err) => {
              console.error('GraphQL error:', err);
            });
          }
    }
  };


  return (
    <>
      <div className="px-4 py-5 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Vital Signs of {user?.name || 'Patient'}</h3>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={() => handleGame(patientId)} className="text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 px-3 py-1 rounded-md">
                                Game
     </button>
     <button onClick={() => handleAssessment(patientId)} className="text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 px-3 py-1 rounded-md">
                                COVID Checklist
     </button>
      {/* Add Vital Sign Form */}
<div className="mb-4">
        
        <form onSubmit={handleAddVitalSign} className="flex flex-col gap-4 mb-4">
          <input
            type="number"
            placeholder="Body Temperature (°F)"
            value={bodyTemperature}
            onChange={(e) => setBodyTemperature(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
          <input
            type="number"
            placeholder="Heart Rate (bpm)"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
          <input
            type="text"
            placeholder="Blood Pressure (mmHg)"
            value={bloodPressure}
            onChange={(e) => setBloodPressure(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            disabled={adding}
          >
            Add Vital Sign
          </button>
          {adding && <p>Adding vital sign...</p>}
          {addingError && <p>Error adding vital sign: {addingError.message}</p>}
        </form>
      </div>

      <div className="mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Body Temperature
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heart Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blood Pressure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Recorded
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vitalSigns.map((sign) => (
                <tr key={sign.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sign.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sign.bodyTemperature} °F</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sign.heartRate} bpm</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sign.bloodPressure} mmHg</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sign.dateRecorded}</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  )
}

export default PatientDashboard