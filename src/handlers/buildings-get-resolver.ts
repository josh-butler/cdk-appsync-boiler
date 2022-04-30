import {AppSyncResolverHandler} from 'aws-lambda';

import {
  ddbMarshal,
  ddbUnmarshal,
  ddbBase64,
  unBase64,
  parseJson,
} from '../common/util/util';
import {EntityTable} from '../common/util/ddb';

const logInfo = (message: string, params: any = {}) => {
  const base = {type: 'BuildingsGetResolver', message};
  console.info(JSON.stringify({...base, ...params}));
};

const logErr = (message: string, params: any = {}) => {
  const base = {type: 'BuildingsGetResolver', message};
  console.error(JSON.stringify({...base, ...params}));
};

// TODO handle parsing & base64 errors
const decodeCursor = (cursor: string | null) => {
  let data = {};
  if (cursor) {
    data = parseJson(unBase64(cursor));
  }

  return Object.keys(data).length ? ddbUnmarshal(data) : null;
};

const ddbCursor = ({GSI1pk = '', sk = '', GSI1sk = '', pk = ''}) => {
  return ddbBase64({GSI1pk, sk, GSI1sk, pk});
};

/**
 * Maps Relay pagination args to DynamoDB query args (eg. {first, after, last, before} => [limit, cursor, reverse])
 * - "first" has precedence, indicates forward pagination
 *    and will use "after" as a query starting point if provided
 * - "last" indicates reverse pagination
 *   "last" & "before" will be ignored if "first" is also provided
 * @param data - appsync query args {first, after, last, before}
 * @returns array - aggregate ddb query flags [limit, cursor, reverse]
 */
const ddbPagination = (data: any) => {
  const {first = 0, after = '', last = 0, before = ''} = data;
  const fwd = first ? [first, after, false] : [];
  const rev = last ? [last, before, true] : [];
  return fwd.length ? fwd : rev;
};

interface BuildingsArgs {
  event: any;
}

class Buildings {
  args: BuildingsArgs;
  props: any;
  queryResults: any = {};

  constructor(args: BuildingsArgs) {
    this.args = args;
    this.props = this.defaultProps();
  }

  defaultProps() {
    const {
      event: {arguments: queryArgs},
    } = this.args;

    // TODO use config value for default limit
    const [limit = 10, cursor = '', reverse = false] = ddbPagination(queryArgs);

    const GSI1pk = 'ORG';
    const index = 'GSI1';
    const startKey = decodeCursor(cursor);

    return {
      GSI1pk,
      index,
      limit,
      startKey,
      reverse,
    };
  }

  get items() {
    return this.queryResults?.Items || [];
  }

  get edges() {
    return this.items.map((item: any) => {
      return {cursor: ddbCursor(item), node: item};
    });
  }

  get pageInfo() {
    const {startKey} = this.props;

    const {LastEvaluatedKey} = this.queryResults;
    const [start = {}] = this.items;
    const [end = {}] = this.items.reverse();

    return {
      hasNextPage: !!LastEvaluatedKey,
      hasPreviousPage: !!startKey,
      startCursor: start.pk ? ddbCursor(start) : null,
      endCursor: end.pk ? ddbCursor(end) : null,
    };
  }

  async queryBuildings() {
    let err;
    let res;
    const {GSI1pk, index, limit, reverse, startKey} = this.props;

    const opts = {limit, reverse, index, startKey};

    logInfo('querying Buildings', {GSI1pk, opts});
    try {
      res = await EntityTable.query(GSI1pk, opts);
    } catch (error) {
      logErr('ddb query failed', {error});
      err = error;
    }

    return {res, err};
  }

  async get() {
    const {res, err} = await this.queryBuildings();
    this.queryResults = res;

    // TODO handle errors
    console.log('err: ', err);

    return {edges: this.edges, pageInfo: this.pageInfo};
  }
}

export const handler: AppSyncResolverHandler<any, any> = async (event: any) => {
  console.log(JSON.stringify(event));

  const buildings = new Buildings({event});

  return buildings.get();
};
