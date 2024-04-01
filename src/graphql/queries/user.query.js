import { gql } from '@apollo/client';

export const GET_USER = gql`
  query GetUser($id: String!) {
    user(id: $id) {
      id
      email
      username
      name
      role
    }
  }
`;

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

export const GET_USER_BY_EMAIL = gql`
  query GetUserByEmail($email: String!) {
    userByEmail(email: $email) {
      id
      email
      name
      role
    }
  }
`;