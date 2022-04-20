/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Org = {
  __typename: "Org",
  id: string,
  name: string,
  _ct?: string | null,
  _md?: string | null,
  users?: UserConnection | null,
};

export type Node = {
  __typename: "Node",
  id: string,
};

export type User = {
  __typename: "User",
  id: string,
  name: string,
  _ct?: string | null,
  _md?: string | null,
};

export type UserConnection = {
  __typename: "UserConnection",
  edges?:  Array<UserEdge | null > | null,
  pageInfo: PageInfo,
  ctx?: string | null,
};

export type UserEdge = {
  __typename: "UserEdge",
  cursor: string,
  node?: User | null,
};

export type PageInfo = {
  __typename: "PageInfo",
  hasNextPage: boolean,
  hasPreviousPage: boolean,
  startCursor?: string | null,
  endCursor?: string | null,
};

export type OrgQueryVariables = {
  id: string,
};

export type OrgQuery = {
  org?:  {
    __typename: "Org",
    id: string,
    name: string,
    _ct?: string | null,
    _md?: string | null,
    users?:  {
      __typename: "UserConnection",
      ctx?: string | null,
    } | null,
  } | null,
};

export type NodeQueryVariables = {
  id: string,
};

export type NodeQuery = {
  node: ( {
      __typename: "Org",
      id: string,
      name: string,
      _ct?: string | null,
      _md?: string | null,
      users?:  {
        __typename: string,
        ctx?: string | null,
      } | null,
    } | {
      __typename: "User",
      id: string,
      name: string,
      _ct?: string | null,
      _md?: string | null,
    }
  ) | null,
};
