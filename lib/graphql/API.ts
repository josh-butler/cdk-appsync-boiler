/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Org = {
  __typename: "Org",
  id: string,
  uid: string,
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
  uid: string,
  pid: string,
  name: string,
  _ct?: string | null,
  _md?: string | null,
};

export type UserConnection = {
  __typename: "UserConnection",
  edges?:  Array<UserEdge | null > | null,
  pageInfo: PageInfo,
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

export type Device = {
  __typename: "Device",
  id: string,
  name?: string | null,
  _ct?: string | null,
  _md?: string | null,
};

export type Sensor = {
  __typename: "Sensor",
  id: string,
  pid: string,
  name: string,
  _ct?: string | null,
  _md?: string | null,
};

export type SensorConnection = {
  __typename: "SensorConnection",
  items?:  Array<Sensor > | null,
  nextToken?: string | null,
};

export type CreateOrgMutationVariables = {
  name: string,
};

export type CreateOrgMutation = {
  createOrg?:  {
    __typename: "Org",
    id: string,
    uid: string,
    name: string,
    _ct?: string | null,
    _md?: string | null,
  } | null,
};

export type CreateUserMutationVariables = {
  orgId: string,
  name: string,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    uid: string,
    pid: string,
    name: string,
    _ct?: string | null,
    _md?: string | null,
  } | null,
};

export type CreateDeviceMutationVariables = {
  name: string,
};

export type CreateDeviceMutation = {
  createDevice?:  {
    __typename: "Device",
    id: string,
    name?: string | null,
    _ct?: string | null,
    _md?: string | null,
  } | null,
};

export type CreateSensorMutationVariables = {
  deviceId: string,
  name: string,
};

export type CreateSensorMutation = {
  createSensor?:  {
    __typename: "Sensor",
    id: string,
    pid: string,
    name: string,
    _ct?: string | null,
    _md?: string | null,
  } | null,
};

export type NodeQueryVariables = {
  id: string,
};

export type NodeQuery = {
  node: ( {
      __typename: "Org",
      id: string,
      uid: string,
      name: string,
      _ct?: string | null,
      _md?: string | null,
    } | {
      __typename: "User",
      id: string,
      uid: string,
      pid: string,
      name: string,
      _ct?: string | null,
      _md?: string | null,
    }
  ) | null,
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
    _ct?: string | null,
    _md?: string | null,
  } | null,
};

export type GetDeviceFnQueryVariables = {
  id: string,
};

export type GetDeviceFnQuery = {
  getDeviceFn?:  {
    __typename: "Device",
    id: string,
    name?: string | null,
    _ct?: string | null,
    _md?: string | null,
  } | null,
};

export type ListDevicesQuery = {
  listDevices?:  Array< {
    __typename: "Device",
    id: string,
    name?: string | null,
    _ct?: string | null,
    _md?: string | null,
  } | null > | null,
};

export type GetDeviceSensorsQueryVariables = {
  deviceId: string,
  limit?: number | null,
  nextToken?: string | null,
};

export type GetDeviceSensorsQuery = {
  getDeviceSensors?:  {
    __typename: "SensorConnection",
    items?:  Array< {
      __typename: "Sensor",
      id: string,
      pid: string,
      name: string,
      _ct?: string | null,
      _md?: string | null,
    } > | null,
    nextToken?: string | null,
  } | null,
};
