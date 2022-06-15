import {JwtValidator} from './util/jwt';
import {IdAuthorizer} from './util/identity';

const logInfo = (message: string, params = {}) => {
  const base = {type: 'TokenAuth', message};
  console.info(JSON.stringify({...base, ...params}));
};

const logErr = (message: string, params = {}) => {
  const base = {type: 'TokenAuth', message};
  console.error(JSON.stringify({...base, ...params}));
};

interface TokenAuthArgs {
  event: any;
  jwks: any;
}

class TokenAuth {
  args: TokenAuthArgs;
  props: any;
  claims: any = {};

  constructor(args: TokenAuthArgs) {
    this.args = args;
    this.props = this.defaultProps();
  }

  defaultProps() {
    const {event, jwks} = this.args;
    const {authorizationToken: token, requestContext: request} = event;

    return {token, jwks, request};
  }

  get valid() {
    const {token, jwks} = this.props;
    return !!(token && jwks);
  }

  async validateToken() {
    const {token, jwks} = this.props;

    const jwt = new JwtValidator({token, jwks});
    const {valid, msg, claims} = await jwt.validate();
    logInfo('token evaluated', {valid, msg});

    this.claims = claims;

    return valid ? null : {isAuthorized: false};
  }

  async authorizeId() {
    const {
      claims,
      props: {request},
    } = this;

    const id = new IdAuthorizer({claims, request});
    return id.authorize();
  }

  // AUTH FLOW ENTRY POINT
  async authenticate() {
    if (!this.valid) {
      logErr('invalid request', {code: 400});
      return {isAuthorized: false};
    }

    const invalidTokenResp = await this.validateToken();
    if (invalidTokenResp) {
      return invalidTokenResp;
    }

    return this.authorizeId();
  }
}

export {TokenAuth};
