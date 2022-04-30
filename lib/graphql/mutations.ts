/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createOrg = /* GraphQL */ `
  mutation CreateOrg($name: String!) {
    createOrg(name: $name) {
      id
      uid
      name
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
    }
  }
`;
export const createDevice = /* GraphQL */ `
  mutation CreateDevice($name: String!) {
    createDevice(name: $name) {
      id
      name
    }
  }
`;
export const createSensor = /* GraphQL */ `
  mutation CreateSensor($deviceId: ID!, $name: String!) {
    createSensor(deviceId: $deviceId, name: $name) {
      id
      pid
      name
    }
  }
`;
export const putBuilding = /* GraphQL */ `
  mutation PutBuilding($name: String!) {
    putBuilding(name: $name) {
      id
      name
    }
  }
`;
export const putRoom = /* GraphQL */ `
  mutation PutRoom($buildingId: ID!, $name: String!) {
    putRoom(buildingId: $buildingId, name: $name) {
      id
      name
    }
  }
`;
