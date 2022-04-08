/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createDevice = /* GraphQL */ `
  mutation CreateDevice($name: String!) {
    createDevice(name: $name) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const createSensor = /* GraphQL */ `
  mutation CreateSensor($deviceId: ID!, $name: String!) {
    createSensor(deviceId: $deviceId, name: $name) {
      id
      deviceId
      name
      createdAt
      updatedAt
    }
  }
`;
