import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation RegisterUser($email: String!, $password: String!, $name: String!, $role: String!) {
    registerUser(email: $email, password: $password, name: $name, role: $role) {
      id
      email
      username
      name
      role
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password)
  }
`;

