const logErr = (message: string, params: any = {}) => {
  const base = {type: 'IdAuthorizer', message};
  console.error(JSON.stringify({...base, ...params}));
};

interface IdAuthorizerParams {
  claims: any;
  request: any;
}

class IdAuthorizer {
  params: IdAuthorizerParams;
  props: any;

  constructor(params: IdAuthorizerParams) {
    this.params = params;
    this.props = this.defaultProps();
  }

  defaultProps() {
    const {claims = {}, request} = this.params;
    const {sub} = claims;

    return {sub, request};
  }

  get valid() {
    const {sub} = this.props;
    return !!sub;
  }

  // TODO: validate id & gql query against ddb access level
  async authorize() {
    const {sub} = this.props;

    if (!this.valid) {
      logErr('invalid identity', {code: 400, sub});
      return {isAuthorized: false};
    }

    return {isAuthorized: true};
  }
}

export {IdAuthorizer};
