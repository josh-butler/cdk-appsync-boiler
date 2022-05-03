import {DynamoDB} from 'aws-sdk';
import * as _crypto from 'crypto';

// returns a V4 UUID
const uuid = () => _crypto.randomUUID();

const base64 = (str: string) => Buffer.from(str).toString('base64');

const unBase64 = (str: string) => Buffer.from(str, 'base64').toString('utf8');

const ddbMarshal = (data: Object) => DynamoDB.Converter.marshall(data);

const ddbUnmarshal = (data: any) => DynamoDB.Converter.unmarshall(data);

const ddbBase64 = (data: Object) =>
  Buffer.from(JSON.stringify(ddbMarshal(data))).toString('base64');

const parseJson = (str: string) => {
  let data = {};
  try {
    data = JSON.parse(str);
  } catch (e) {
    console.error(e);
  }

  return data;
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
// TODO: unit tests
const ddbPagination = (data: any) => {
  const {first = 0, after = '', last = 0, before = ''} = data;
  const fwd = first ? [first, after, false] : [];
  const rev = last ? [last, before, true] : [];
  return fwd.length ? fwd : rev;
};

export {
  parseJson,
  uuid,
  base64,
  unBase64,
  ddbMarshal,
  ddbUnmarshal,
  ddbBase64,
  ddbPagination,
};
