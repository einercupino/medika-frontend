import { gql } from '@apollo/client';

export const ADD_VITAL_SIGN = gql`
  mutation AddVitalSign($patientId: ID!, $bodyTemperature: Float, $heartRate: Float, $bloodPressure: String) {
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

export const UPDATE_VITAL_SIGN = gql`
  mutation UpdateVitalSign($id: ID!, $bodyTemperature: Float, $heartRate: Float, $bloodPressure: String) {
    updateVitalSign(id: $id, bodyTemperature: $bodyTemperature, heartRate: $heartRate, bloodPressure: $bloodPressure) {
      id
      patientId
      bodyTemperature
      heartRate
      bloodPressure
      dateRecorded
    }
  }
`;

export const DELETE_VITAL_SIGN = gql`
  mutation DeleteVitalSign($id: ID!) {
    deleteVitalSign(id: $id) {
      id
    }
  }
`;