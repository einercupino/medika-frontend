import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, gql } from '@apollo/client'
import { GET_VITAL_SIGNS_BY_PATIENT } from '../graphql/queries/vitalsign.query'
import { ADD_VITAL_SIGN } from '../graphql/mutations/vitalsign.mutation'
import { GET_USER } from '../graphql/queries/user.query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auths/AuthContext'

const PatientDashboard = () => {
  const medikaLogo = '/medika.png'
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
      <div className="min-h-screen bg-gray-100 p-4">
  {/* Top Section */}
  <div className="flex justify-between items-start mb-6">
    {/* Logo Section */}
    <div className="w-1/4">
      <img src={medikaLogo} alt="Logo" className="w-50 h-48" />
    </div>

    {/* Add Vital Signs Form */}
    <div className="flex-grow ml-4">
      <form onSubmit={handleAddVitalSign} className="space-y-4">
        <input
          type="number"
          placeholder="Body Temperature (°F)"
          value={bodyTemperature}
          onChange={(e) => setBodyTemperature(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
        <input
          type="number"
          placeholder="Heart Rate (bpm)"
          value={heartRate}
          onChange={(e) => setHeartRate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
        <input
          type="text"
          placeholder="Blood Pressure (mmHg)"
          value={bloodPressure}
          onChange={(e) => setBloodPressure(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
          disabled={adding}
        >
          Add Vital Sign
        </button>
      </form>
    </div>
  </div>
  {/* Middle Section */}
<div className="flex justify-between items-center mb-6">
  <h3 className="text-lg leading-6 font-medium text-gray-900">Vital Signs of {user?.name || 'Patient'}</h3>
  <div className="flex items-center gap-4">
    <button onClick={() => handleAssessment(patientId)} className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md">
      COVID Checklist
    </button>
    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md">
      Logout
    </button>
  </div>
</div>


  {/* Table Section */}
  <div className="mb-6">
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

    </>
  )
}

export default PatientDashboard