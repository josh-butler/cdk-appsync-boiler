/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getDevice = /* GraphQL */ `
  query GetDevice($id: ID!, $limit: Int) {
    getDevice(id: $id, limit: $limit) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const listDevices = /* GraphQL */ `
  query ListDevices {
    listDevices {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
