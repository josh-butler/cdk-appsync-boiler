import {AppSyncResolverHandler} from 'aws-lambda';
import {DynamoDB} from 'aws-sdk';

import {unBase64, parseJson} from '../common/util/util';
import {EntityTable} from '../common/util/ddb';

const logInfo = (message: string, params: any = {}) => {
  const base = {type: 'UsersGetResolver', message};
  console.info(JSON.stringify({...base, ...params}));
};

const logErr = (message: string, params: any = {}) => {
  const base = {type: 'UsersGetResolver', message};
  console.error(JSON.stringify({...base, ...params}));
};

// TODO handle parsing & base64 errors
const decodeCursor = (cursor: string | null) => {
  let data = {};
  if (cursor) {
    data = parseJson(unBase64(cursor));
  }

  return Object.keys(data).length ? DynamoDB.Converter.unmarshall(data) : null;
};

const getUsers = async (
  orgId: string,
  first: number,
  after: string | null,
  last: number,
  before: string | null
) => {
  const pk = `ORG#${orgId}`;
  let res;
  let err;

  const startKey = decodeCursor(after || before);
  const reverse = !!before;
  const limit = first || last || 10;

  const opts = startKey
    ? {beginsWith: 'USER#', limit, reverse, startKey}
    : {beginsWith: 'USER#', limit, reverse};

  try {
    res = await EntityTable.query(pk, opts);
  } catch (error: any) {
    logErr('ddb error', {error});
    err = error;
  }

  return {res, err};
};

const getEdges = (items = []) => {
  return items.map(({name, id, created: _ct, modified: _md}) => {
    return {cursor: id, node: {name, id, _ct, _md}};
  });
};

const getPageInfo = (res: any, edges: any, after: string, before: string) => {
  const {LastEvaluatedKey} = res;
  const [first = {}] = edges;
  const [last = {}] = edges.reverse();

  return {
    hasNextPage: !!after && !!LastEvaluatedKey,
    hasPreviousPage: !!before && !!LastEvaluatedKey,
    startCursor: first.cursor || null,
    endCursor: last.cursor || null,
  };
};

export const handler: AppSyncResolverHandler<any, any> = async (event: any) => {
  console.log(JSON.stringify(event));

  const {
    arguments: {first = 0, after = '', last = 0, before = ''} = {},
    source: {uid = ''} = {},
  } = event;

  const {res} = await getUsers(uid, first, after, last, before);
  logInfo('ddb response', {res});

  const edges = res ? getEdges(res.Items) : [];
  const pageInfo = res ? getPageInfo(res, edges, after, before) : {};

  const data = {edges, pageInfo};
  logInfo('gql response', {data});

  return data;
};
