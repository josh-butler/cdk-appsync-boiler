/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type User = {
  __typename: "User",
  id: string,
  name?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type CreateUserMutationVariables = {
  name: string,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    name?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
  limit?: number | null,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    name?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type ListUsersQuery = {
  listUsers?:  Array< {
    __typename: "User",
    id: string,
    name?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null > | null,
};
