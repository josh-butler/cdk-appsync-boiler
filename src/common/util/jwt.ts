import {verify} from 'jsonwebtoken';
import JwkToPem from 'jwk-to-pem';

import {unBase64} from './util';

const logErr = (message: string, params: any = {}) => {
  const base = {type: 'JwtValidator', message};
  console.error(JSON.stringify({...base, ...params}));
};

const tokenHeader = (token: string) => {
  const [header = ''] = token.split('.');
  return header ? JSON.parse(unBase64(header)) : {};
};

const findJwk = (jwks: any, id: string) => {
  const {keys = []} = jwks;
  const [jwk = {}] = keys.reduce(
    (acc: any, val: any) => (val.kid === id ? [...acc, val] : acc),
    []
  );
  return jwk;
};

const verifyJwt = async (token: string, pem: any, algorithms: any) =>
  new Promise((resolve, reject) => {
    verify(token, pem, algorithms, (err: any, decoded: any) => {
      if (err) {
        return reject(err);
      }
      return resolve(decoded);
    });
  });

interface JwtValidatorParams {
  token: string;
  jwks: any;
}

class JwtValidator {
  params: JwtValidatorParams;
  props: any;

  constructor(params: JwtValidatorParams) {
    this.params = params;
    this.props = this.defaultProps();
  }

  defaultProps() {
    const {jwks, token} = this.params;

    const {alg, kid} = tokenHeader(token);

    return {
      jwks,
      token,
      alg,
      kid,
    };
  }

  get jwk() {
    const {jwks, kid} = this.props;
    return findJwk(jwks, kid);
  }

  get pem() {
    if (!Object.keys(this.jwk).length) {
      throw new Error('no matching jwk');
    }
    return JwkToPem(this.jwk);
  }

  async validate() {
    const {token, alg} = this.props;

    let msg = 'VALID';
    let valid = true;
    let claims: any = {};

    try {
      claims = await verifyJwt(token, this.pem, {algorithms: [alg]});
    } catch (err: any) {
      switch (err.name) {
        case 'TokenExpiredError':
          msg = 'TOKEN_EXPIRED';
          break;
        case 'JsonWebTokenError':
          msg = 'JWT_ERROR';
          break;
        default:
          msg = err.name;
          break;
      }

      valid = false;
      logErr(msg);
    }

    return {valid, msg, claims};
  }
}

export {JwtValidator};
