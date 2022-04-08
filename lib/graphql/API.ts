/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Device = {
  __typename: "Device",
  id: string,
  name?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type CreateDeviceMutationVariables = {
  name: string,
};

export type CreateDeviceMutation = {
  createDevice?:  {
    __typename: "Device",
    id: string,
    name?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type GetDeviceQueryVariables = {
  id: string,
  limit?: number | null,
};

export type GetDeviceQuery = {
  getDevice?:  {
    __typename: "Device",
    id: string,
    name?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type ListDevicesQuery = {
  listDevices?:  Array< {
    __typename: "Device",
    id: string,
    name?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null > | null,
};
