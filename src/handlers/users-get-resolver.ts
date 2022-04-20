import {AppSyncResolverHandler} from 'aws-lambda';
import {UsersQueryVariables} from '../../lib/graphql/API';

import {base64, unBase64, parseJson} from '../common/util/util';
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

  return Object.keys(data).length ? data : null;
};

// const encodeCursor = (data: object) => {
//   return base64(JSON.stringify(data));
// };

const getUsers = async (orgId: string, first: number, after: string | null) => {
  console.log('after: ', after);
  const pk = `ORG#${orgId}`;
  let res;
  let err;

  const startKey = decodeCursor(after);

  const opts = startKey
    ? {beginsWith: 'USER#', limit: first, startKey}
    : {beginsWith: 'USER#', limit: first};

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

const getPageInfo = (res: any, edges: any) => {
  const {LastEvaluatedKey} = res;
  const [first = {}] = edges;
  const [last = {}] = edges.reverse();

  return {
    hasNextPage: !!LastEvaluatedKey,
    hasPreviousPage: false, // TODO add prev eval logic
    startCursor: first.cursor || null,
    endCursor: last.cursor || null,
  };
};

export const handler: AppSyncResolverHandler<
  UsersQueryVariables,
  any
> = async event => {
  console.log(JSON.stringify(event));

  const {
    arguments: {
      orgId = '',
      first = 10,
      after = '',
      last = 10,
      before = '',
    } = {},
  } = event;

  const {res} = await getUsers(orgId, first, after);
  logInfo('ddb response', {res});

  console.log('res: ', res);

  const edges = res ? getEdges(res.Items) : [];
  const pageInfo = res ? getPageInfo(res, edges) : {};
  console.log('pageInfo: ', pageInfo);

  // const data = {users: {edges, pageInfo}};
  // const data = {edges: edges[0], pageInfo};
  const data = {edges, pageInfo};
  logInfo('gql response', {data});

  return data;
};
