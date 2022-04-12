import {AppSyncResolverHandler} from 'aws-lambda';
import {GetDeviceFnQueryVariables} from '../../lib/graphql/API';

import {Device as DeviceEntity} from '../common/util/ddb';

const logInfo = (message: string, params: any = {}) => {
  const base = {type: 'DeviceGetResolver', message};
  console.info(JSON.stringify({...base, ...params}));
};

const logErr = (message: string, params: any = {}) => {
  const base = {type: 'DeviceGetResolver', message};
  console.error(JSON.stringify({...base, ...params}));
};

const deviceAttrs = ({id = '', name = '', modified = '', created = ''}) => ({
  id,
  name,
  _md: modified,
  _ct: created,
});

const getDevice = async (id: string) => {
  let res: any = {};

  const pk = `DEVICE#${id}`;
  const item = {pk, sk: pk};
  logInfo('ddb get device', {item});

  try {
    res = await DeviceEntity.get(item);
  } catch (e: any) {
    logErr(e.message);
  }

  return res.Item || {};
};

export const handler: AppSyncResolverHandler<
  GetDeviceFnQueryVariables,
  any
> = async event => {
  console.log(JSON.stringify(event));

  const {
    arguments: {id},
  } = event;

  const data = await getDevice(id);

  return data.id ? deviceAttrs(data) : null;
};
