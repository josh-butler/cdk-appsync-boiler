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
export const getDeviceFn = /* GraphQL */ `
  query GetDeviceFn($id: ID!) {
    getDeviceFn(id: $id) {
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
export const getDeviceSensors = /* GraphQL */ `
  query GetDeviceSensors($deviceId: ID!, $limit: Int, $nextToken: String) {
    getDeviceSensors(
      deviceId: $deviceId
      limit: $limit
      nextToken: $nextToken
    ) {
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
