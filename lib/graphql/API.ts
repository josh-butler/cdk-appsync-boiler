/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Org = {
  __typename: "Org",
  id: string,
  uid: string,
  name: string,
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
};

export type Building = {
  __typename: "Building",
  id: string,
  name: string,
  rooms?: RoomConnection | null,
};

export type RoomConnection = {
  __typename: "RoomConnection",
  edges?:  Array<RoomEdge | null > | null,
  pageInfo: PageInfo,
  ctx?: string | null,
};

export type RoomEdge = {
  __typename: "RoomEdge",
  cursor: string,
  node?: Room | null,
};

export type Room = {
  __typename: "Room",
  id: string,
  name: string,
};

export type PageInfo = {
  __typename: "PageInfo",
  hasNextPage: boolean,
  hasPreviousPage: boolean,
  startCursor?: string | null,
  endCursor?: string | null,
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

export type Device = {
  __typename: "Device",
  id: string,
  name?: string | null,
};

export type Sensor = {
  __typename: "Sensor",
  id: string,
  pid: string,
  name: string,
};

export type Fob = {
  __typename: "Fob",
  id: string,
  name?: string | null,
};

export type SensorConnection = {
  __typename: "SensorConnection",
  items?:  Array<Sensor > | null,
  nextToken?: string | null,
};

export type Tenant = {
  __typename: "Tenant",
  id: string,
  name?: string | null,
  fob?: Fob | null,
};

export type OrgConnection = {
  __typename: "OrgConnection",
  edges?:  Array<OrgEdge | null > | null,
  pageInfo: PageInfo,
  ctx?: string | null,
};

export type OrgEdge = {
  __typename: "OrgEdge",
  cursor: string,
  node?: Org | null,
};

export type BuildingConnection = {
  __typename: "BuildingConnection",
  edges?:  Array<BuildingEdge | null > | null,
  pageInfo: PageInfo,
  ctx?: string | null,
};

export type BuildingEdge = {
  __typename: "BuildingEdge",
  cursor: string,
  node?: Building | null,
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
  } | null,
};

export type PutFobMutationVariables = {
  name: string,
};

export type PutFobMutation = {
  putFob?:  {
    __typename: "Fob",
    id: string,
    name?: string | null,
  } | null,
};

export type PutTenantMutationVariables = {
  fobId: string,
  name: string,
};

export type PutTenantMutation = {
  putTenant?:  {
    __typename: "Room",
    id: string,
    name: string,
  } | null,
};

export type PutBuildingMutationVariables = {
  name: string,
};

export type PutBuildingMutation = {
  putBuilding?:  {
    __typename: "Building",
    id: string,
    name: string,
    rooms?:  {
      __typename: "RoomConnection",
      ctx?: string | null,
    } | null,
  } | null,
};

export type PutRoomMutationVariables = {
  buildingId: string,
  name: string,
};

export type PutRoomMutation = {
  putRoom?:  {
    __typename: "Room",
    id: string,
    name: string,
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
  } | null,
};

export type ListDevicesQuery = {
  listDevices?:  Array< {
    __typename: "Device",
    id: string,
    name?: string | null,
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
    } > | null,
    nextToken?: string | null,
  } | null,
};

export type GetOrgQueryVariables = {
  uid: string,
};

export type GetOrgQuery = {
  getOrg?:  {
    __typename: "Org",
    id: string,
    uid: string,
    name: string,
  } | null,
};

export type GetTenantQueryVariables = {
  id: string,
};

export type GetTenantQuery = {
  getTenant?:  {
    __typename: "Tenant",
    id: string,
    name?: string | null,
    fob?:  {
      __typename: "Fob",
      id: string,
      name?: string | null,
    } | null,
  } | null,
};

export type GetOrgsQueryVariables = {
  first?: number | null,
  after?: string | null,
  last?: number | null,
  before?: string | null,
};

export type GetOrgsQuery = {
  getOrgs?:  {
    __typename: "OrgConnection",
    edges?:  Array< {
      __typename: "OrgEdge",
      cursor: string,
    } | null > | null,
    pageInfo:  {
      __typename: "PageInfo",
      hasNextPage: boolean,
      hasPreviousPage: boolean,
      startCursor?: string | null,
      endCursor?: string | null,
    },
    ctx?: string | null,
  } | null,
};

export type GetBuildingQueryVariables = {
  id: string,
};

export type GetBuildingQuery = {
  getBuilding?:  {
    __typename: "Building",
    id: string,
    name: string,
    rooms?:  {
      __typename: "RoomConnection",
      ctx?: string | null,
    } | null,
  } | null,
};

export type GetBuildingsQueryVariables = {
  first?: number | null,
  after?: string | null,
  last?: number | null,
  before?: string | null,
};

export type GetBuildingsQuery = {
  getBuildings?:  {
    __typename: "BuildingConnection",
    edges?:  Array< {
      __typename: "BuildingEdge",
      cursor: string,
    } | null > | null,
    pageInfo:  {
      __typename: "PageInfo",
      hasNextPage: boolean,
      hasPreviousPage: boolean,
      startCursor?: string | null,
      endCursor?: string | null,
    },
    ctx?: string | null,
  } | null,
};

export type RoomsQueryVariables = {
  first?: number | null,
  after?: string | null,
  last?: number | null,
  before?: string | null,
};

export type RoomsQuery = {
  rooms?:  {
    __typename: "RoomConnection",
    edges?:  Array< {
      __typename: "RoomEdge",
      cursor: string,
    } | null > | null,
    pageInfo:  {
      __typename: "PageInfo",
      hasNextPage: boolean,
      hasPreviousPage: boolean,
      startCursor?: string | null,
      endCursor?: string | null,
    },
    ctx?: string | null,
  } | null,
};

export type OrgQueryVariables = {
  id: string,
};

export type OrgQuery = {
  org?:  {
    __typename: "Org",
    id: string,
    uid: string,
    name: string,
  } | null,
};

export type FobQueryVariables = {
  id?: string | null,
};

export type FobQuery = {
  fob?:  {
    __typename: "Fob",
    id: string,
    name?: string | null,
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
    } | {
      __typename: "User",
      id: string,
      uid: string,
      pid: string,
      name: string,
    } | {
      __typename: "Building",
      id: string,
      name: string,
      rooms?:  {
        __typename: string,
        ctx?: string | null,
      } | null,
    } | {
      __typename: "Room",
      id: string,
      name: string,
    }
  ) | null,
};
