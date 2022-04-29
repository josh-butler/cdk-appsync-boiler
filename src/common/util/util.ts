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

export {parseJson, uuid, base64, unBase64, ddbMarshal, ddbUnmarshal, ddbBase64};
