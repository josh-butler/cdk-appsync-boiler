// import {SecretsManager} from 'aws-sdk';
import {verify} from 'jsonwebtoken';
import {AppSyncAuthorizerEvent, AppSyncAuthorizerResult} from 'aws-lambda';

const {JWT_PUBLIC_KEY = ''} = process.env;

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

  let decoded;
  const {authorizationToken} = event;

  try {
    decoded = await verifyJwt(authorizationToken, JWT_PUBLIC_KEY);
  } catch (error: any) {
    logErr('Unauthorized', {error});
  }

  const isAuthorized = decoded ? true : false;

  return {isAuthorized};
};
