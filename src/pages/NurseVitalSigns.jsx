// NurseVitalSigns.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useParams, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const GET_VITAL_SIGNS_BY_PATIENT = gql`
  query GetVitalSignsByPatient($patientId: ID!) {
    vitalSignsByPatient(patientId: $patientId) {
      id
      patientId
      bodyTemperature
      heartRate
      bloodPressure
      dateRecorded
    }
  }
`;

const ADD_VITAL_SIGN = gql`
  mutation AddVitalSign($patientId: ID!, $bodyTemperature: Float!, $heartRate: Float!, $bloodPressure: String!) {
    addVitalSign(patientId: $patientId, bodyTemperature: $bodyTemperature, heartRate: $heartRate, bloodPressure: $bloodPressure) {
      id
      patientId
      bodyTemperature
      heartRate
      bloodPressure
      dateRecorded
    }
  }
`;

function NurseVitalSigns() {
  const location = useLocation();
  const { patientId } = useParams();
  const patientName = location.state?.name;
  const navigate = useNavigate();
  console.log('Patient ID:', patientId, 'Patient Name:', patientName)

  // State for new vital sign inputs
  const [bodyTemperature, setBodyTemperature] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  
  // get vital signs of patient
  const { loading, error, data } = useQuery(GET_VITAL_SIGNS_BY_PATIENT, {
    variables: { patientId },
  });

  // Apollo useMutation hook for adding a new vital sign
  const [addVitalSign, { loading: adding, error: addingError }] = useMutation(ADD_VITAL_SIGN, {
    refetchQueries: [
      // After adding, refetch vital signs
      { query: GET_VITAL_SIGNS_BY_PATIENT, variables: { patientId } }
    ],
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Assuming the data returned is an array of vital signs
  const vitalSigns = data?.vitalSignsByPatient || [];

  const handleDiagnose = (vitalSignId) => {
    // Navigate to diagnose page
    navigate(`/nurse/vital-signs/diagnose/${vitalSignId}`);
    console.log('Navigating to diagnose page');
  }

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
    <div className="px-4 py-5 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Vital Signs of {patientName}</h3>

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
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
                  <td onClick={() => handleDiagnose(sign.id)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-2 px-3 py-1 rounded-md">
                        Diagnose</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default NurseVitalSigns;
