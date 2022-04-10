import {SecretsManager} from 'aws-sdk';
import {verify} from 'jsonwebtoken';
import {AppSyncAuthorizerEvent, AppSyncAuthorizerResult} from 'aws-lambda';

import {getSecretData} from '../common/util/secret';
import config from '../common/config';

const {region, secretId = ''} = config;
const sm = new SecretsManager({region});

let publicKey: string;

// const {JWT_PUBLIC_KEY = ''} = process.env;

const logErr = (message: string, params: any = {}) => {
  const base = {type: 'GqlAuthorizer', message};
  console.error(JSON.stringify({...base, ...params}));
};

const verifyJwt = async (token: string, pubkicKey: string) =>
  new Promise((resolve, reject) => {
    verify(token, pubkicKey, (err: any, decoded: any) => {
      if (err) {
        return reject(err);
      }
      return resolve(decoded);
    });
  });

export const handler = async (
  event: AppSyncAuthorizerEvent
): Promise<AppSyncAuthorizerResult> => {
  console.log(JSON.stringify(event));

  // const pubkicKey = await getSecretData(sm, secretId);
  publicKey = publicKey || (await getSecretData(sm, secretId));

  let decoded;
  const {authorizationToken} = event;

  try {
    decoded = await verifyJwt(authorizationToken, publicKey);
  } catch (error: any) {
    logErr('Unauthorized', {error});
  }

  const isAuthorized = decoded ? true : false;

  return {isAuthorized};
};
