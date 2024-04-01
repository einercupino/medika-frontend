import { gql } from '@apollo/client';

export const GET_VITAL_SIGN = gql`
  query GetVitalSign($id: ID!) {
    vitalSign(id: $id) {
      id
      patientId
      bodyTemperature
      heartRate
      bloodPressure
      dateRecorded
    }
  }
`;

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