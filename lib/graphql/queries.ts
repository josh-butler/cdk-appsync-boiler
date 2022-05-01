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
export const getOrg = /* GraphQL */ `
  query GetOrg($uid: ID!) {
    getOrg(uid: $uid) {
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
export const getBuilding = /* GraphQL */ `
  query GetBuilding($id: ID!) {
    getBuilding(id: $id) {
      id
      name
      rooms {
        ctx
      }
    }
  }
`;
export const getBuildings = /* GraphQL */ `
  query GetBuildings($first: Int, $after: String, $last: Int, $before: String) {
    getBuildings(first: $first, after: $after, last: $last, before: $before) {
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
export const getRooms = /* GraphQL */ `
  query GetRooms($first: Int, $after: String, $last: Int, $before: String) {
    getRooms(first: $first, after: $after, last: $last, before: $before) {
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
export const org = /* GraphQL */ `
  query Org($id: ID!) {
    org(id: $id) {
      id
      uid
      name
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
      ... on Building {
        name
        rooms {
          ctx
        }
      }
      ... on Room {
        name
      }
    }
  }
`;
