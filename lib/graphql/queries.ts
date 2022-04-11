/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getDevice = /* GraphQL */ `
  query GetDevice($id: ID!, $limit: Int) {
    getDevice(id: $id, limit: $limit) {
      id
      name
      _ct
      _md
    }
  }
`;
export const listDevices = /* GraphQL */ `
  query ListDevices {
    listDevices {
      id
      name
      _ct
      _md
    }
  }
`;
export const getMoreSensors = /* GraphQL */ `
  query GetMoreSensors($deviceId: ID!, $limit: Int, $nextToken: String) {
    getMoreSensors(deviceId: $deviceId, limit: $limit, nextToken: $nextToken) {
      items {
        id
        pid
        name
        _ct
        _md
      }
      nextToken
    }
  }
`;
