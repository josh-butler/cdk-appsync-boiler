import {AppSyncAuthorizerEvent, AppSyncAuthorizerResult} from 'aws-lambda';
import {getJwks} from '../common/util/api';
import {TokenAuth} from '../common/auth';

import config from '../common/config';

let jwks: any;

export const handler = async (
  event: AppSyncAuthorizerEvent
): Promise<AppSyncAuthorizerResult> => {
  console.log(JSON.stringify(event.requestContext));

  jwks = jwks || (await getJwks(config.jwksUrl));

  const token = new TokenAuth({event, jwks});

  return token.authenticate();
};
