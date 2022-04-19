/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const node = /* GraphQL */ `
  query Node($id: ID!) {
    node(id: $id) {
      id
      ... on User {
        uid
        pid
        name
        _ct
        _md
      }
      ... on Org {
        uid
        name
        _ct
        _md
      }
    }
  }
`;
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
export const users = /* GraphQL */ `
  query Users($orgId: ID!, $first: Int!, $after: String) {
    users(orgId: $orgId, first: $first, after: $after) {
      edges {
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;
