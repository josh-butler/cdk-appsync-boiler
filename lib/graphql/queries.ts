/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!, $limit: Int) {
    getUser(id: $id, limit: $limit) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers {
    listUsers {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
