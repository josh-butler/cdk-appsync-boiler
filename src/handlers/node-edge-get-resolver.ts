import {DynamoDB} from 'aws-sdk';

import {AppSyncResolverHandler} from 'aws-lambda';
// import {GetDeviceFnQueryVariables} from '../../lib/graphql/API';

// import {EntityTable} from '../common/util/ddb';
import {unBase64, parseJson} from '../common/util/util';

const DocumentClient = new DynamoDB.DocumentClient();

// const logInfo = (message: string, params: any = {}) => {
//   const base = {type: 'NodeGetResolver', message};
//   console.info(JSON.stringify({...base, ...params}));
// };

// const logErr = (message: string, params: any = {}) => {
//   const base = {type: 'NodeGetResolver', message};
//   console.error(JSON.stringify({...base, ...params}));
// };

const getNode = async (key: any) => {
  return DocumentClient.get({
    TableName: process.env.ENTITY_TABLE || '',
    Key: key,
  }).promise();
};

export const handler: AppSyncResolverHandler<any, any> = async (event: any) => {
  console.log(JSON.stringify(event));

  const {source: {node: {id = ''} = {}} = {}} = event;

  const dbid = parseJson(unBase64(id));

  const key = DynamoDB.Converter.unmarshall(dbid);
  console.log('key: ', key);

  const data = await getNode(key);
  console.log('data: ', data);

  return data.Item || {};
};
