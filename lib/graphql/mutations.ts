/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createOrg = /* GraphQL */ `
  mutation CreateOrg($name: String!) {
    createOrg(name: $name) {
      id
      uid
      name
      _ct
      _md
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser($orgId: ID!, $name: String!) {
    createUser(orgId: $orgId, name: $name) {
      id
      uid
      pid
      name
      _ct
      _md
    }
  }
`;
export const createDevice = /* GraphQL */ `
  mutation CreateDevice($name: String!) {
    createDevice(name: $name) {
      id
      name
      _ct
      _md
    }
  }
`;
export const createSensor = /* GraphQL */ `
  mutation CreateSensor($deviceId: ID!, $name: String!) {
    createSensor(deviceId: $deviceId, name: $name) {
      id
      pid
      name
      _ct
      _md
    }
  }
`;
