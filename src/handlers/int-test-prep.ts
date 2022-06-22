// import {deleteSsmParam} from '../common/util/ssm';
import {fnResp400, fnResp500} from '../common/util/response';
import {httpPost} from '../common/util/api';
import {Device as DeviceEntity} from '../common/util/ddb';
import {expires, unBase64} from '../common/util/util';

// import config from '../common/config';

// const {paramsPrefix = ''} = config;

const logInfo = (message: string, params: any = {}) => {
  const base = {type: 'IntTestPrep', message};
  console.info(JSON.stringify({...base, ...params}));
};

const logErr = (message: string, params: any = {}) => {
  const base = {type: 'IntTestPrep', message};
  console.error(JSON.stringify({...base, ...params}));
};

const identityA = (typ = 'expired', hours = 0): any => {
  return {
    email: 'fred.flintstone.ext@siemens.com',
    given_name: 'Fred',
    family_name: 'Flintston',
    iss: 'https://myid-qa.siemens.com',
    sub: 'Siemens|Z004H9BC',
    preferred_given_name: 'Fred',
    preferred_family_name: 'Flintstone',
    org_code: 'SI RSS SV DP',
    country: 'US',
    city: 'Bedrock',
    display_name: 'Flintstone, Fred (ext) (SI RSS SV DP)',
    exp: expires(hours),
    typ,
  };
};

const identityB = (typ = 'expired', hours = 0): any => {
  return {
    email: 'barney.rubble.ext@siemens.com',
    given_name: 'Barney',
    family_name: 'Rubble',
    iss: 'https://myid-qa.siemens.com',
    sub: 'Siemens|Z004H8BC',
    preferred_given_name: 'Barney',
    preferred_family_name: 'Rubble',
    org_code: 'SI RSS SV DP',
    country: 'US',
    city: 'Stone Valley',
    display_name: 'Rubble, Barney (ext) (SI RSS SV DP)',
    exp: expires(hours),
    typ,
  };
};

interface IntTestArgs {
  event: any;
}

class IntTest {
  args: IntTestArgs;
  props: any;
  tokens: any;

  constructor(args: IntTestArgs) {
    this.args = args;
    this.props = this.defaultProps();
  }

  defaultProps() {
    const {event: {tokenUrl} = {}} = this.args;

    return {tokenUrl};
  }

  get valid() {
    const {tokenUrl} = this.props;
    return !!tokenUrl;
  }

  async getTokens() {
    const {tokenUrl: url} = this.props;
    const ids = [identityA('admin', 2), identityB('user', 2), identityB()];

    const responses = await Promise.all(ids.map(body => httpPost({url, body})));

    const errors = responses.filter(({err}) => !!err);

    const [admin, user, expired] = responses.map(
      ({data = {}}) => data?.access_token
    );
    this.tokens = {admin, user, expired};

    return errors.length ? fnResp500(errors) : null;
  }

  async putDevice() {
    let err;

    const id = 'abc123';
    const pk = `DEVICE#${id}`;
    const GSI1sk = 'DEVICE';
    const name = 'test-device';

    const item = {
      pk,
      sk: pk,
      GSI1sk,
      id,
      name,
    };

    logInfo('ddb put', {item});

    try {
      await DeviceEntity.put(item);
    } catch (error) {
      logErr('ddb put failed', {error});
      err = error;
    }

    return err;
  }

  async prepare() {
    console.log('this.props: ', this.props);

    if (!this.valid) {
      logErr('invalid request', {tokenUrl: this.props.tokenUrl});
      return fnResp400([{message: 'invalid request'}]);
    }

    const tokensErrResp = await this.getTokens();
    if (tokensErrResp) {
      return tokensErrResp;
    }

    // await this.putDevice();
    console.log('this.tokens: ', this.tokens);

    return {};
  }
}

export const handler = async (event: any) => {
  console.log(JSON.stringify(event));

  const test = new IntTest({event});

  return test.prepare();
};
