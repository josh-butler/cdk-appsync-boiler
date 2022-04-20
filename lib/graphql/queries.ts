/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const org = /* GraphQL */ `
  query Org($id: ID!) {
    org(id: $id) {
      id
      name
      _ct
      _md
      users {
        ctx
      }
    }
  }
`;
export const node = /* GraphQL */ `
  query Node($id: ID!) {
    node(id: $id) {
      id
      ... on Org {
        name
        _ct
        _md
        users {
          ctx
        }
      }
      ... on User {
        name
        _ct
        _md
      }
    }
  }
`;
