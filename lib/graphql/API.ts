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

export type Sensor = {
  __typename: "Sensor",
  id: string,
  deviceId: string,
  name: string,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type SensorConnection = {
  __typename: "SensorConnection",
  items?:  Array<Sensor > | null,
  nextToken?: string | null,
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

export type CreateSensorMutationVariables = {
  deviceId: string,
  name: string,
};

export type CreateSensorMutation = {
  createSensor?:  {
    __typename: "Sensor",
    id: string,
    deviceId: string,
    name: string,
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

export type GetMoreSensorsQueryVariables = {
  deviceId: string,
  limit?: number | null,
  nextToken?: string | null,
};

export type GetMoreSensorsQuery = {
  getMoreSensors?:  {
    __typename: "SensorConnection",
    items?:  Array< {
      __typename: "Sensor",
      id: string,
      deviceId: string,
      name: string,
      createdAt?: string | null,
      updatedAt?: string | null,
    } > | null,
    nextToken?: string | null,
  } | null,
};
