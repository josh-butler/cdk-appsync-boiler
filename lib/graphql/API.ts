/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

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
