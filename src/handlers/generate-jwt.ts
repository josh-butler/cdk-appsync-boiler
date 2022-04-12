import {SecretsManager} from 'aws-sdk';
import {sign, Algorithm} from 'jsonwebtoken';

import {getSecretData} from '../common/util/secret';
import config from '../common/config';

const {region, secretId = ''} = config;
const sm = new SecretsManager({region});

let privateKey: string;

const logInfo = (message: string, params: any = {}) => {
  const base = {type: 'GenerateJwt', message};
  console.info(JSON.stringify({...base, ...params}));
};

const logErr = (message: string, params: any = {}) => {
  const base = {type: 'GenerateJwt', message};
  console.error(JSON.stringify({...base, ...params}));
};

const createJwt = async (
  payload: object,
  privateKey: string,
  algorithm: Algorithm = 'RS256'
) =>
  new Promise((resolve, reject) => {
    sign(payload, privateKey, {algorithm}, (err: any, decoded: any) => {
      if (err) {
        return reject(err);
      }
      return resolve(decoded);
    });
  });

export const handler = async () => {
  privateKey = privateKey || (await getSecretData(sm, secretId));

  let token;

  logInfo('generating token');
  try {
    token = await createJwt({role: 'admin'}, privateKey);
  } catch (error: any) {
    logErr('JWT creation failed', {error});
  }

  return {token};
};
