/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getDevice = /* GraphQL */ `
  query GetDevice($id: ID!, $limit: Int) {
    getDevice(id: $id, limit: $limit) {
      id
      name
    }
  }
`;
export const getDeviceFn = /* GraphQL */ `
  query GetDeviceFn($id: ID!) {
    getDeviceFn(id: $id) {
      id
      name
    }
  }
`;
export const listDevices = /* GraphQL */ `
  query ListDevices {
    listDevices {
      id
      name
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
      }
      nextToken
    }
  }
`;
export const org = /* GraphQL */ `
  query Org($id: ID!) {
    org(id: $id) {
      id
      uid
      name
    }
  }
`;
export const getOrgs = /* GraphQL */ `
  query GetOrgs($first: Int, $after: String, $last: Int, $before: String) {
    getOrgs(first: $first, after: $after, last: $last, before: $before) {
      edges {
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      ctx
    }
  }
`;
export const node = /* GraphQL */ `
  query Node($id: ID!) {
    node(id: $id) {
      id
      ... on Org {
        uid
        name
      }
      ... on User {
        uid
        pid
        name
      }
    }
  }
`;
