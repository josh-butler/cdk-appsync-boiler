import {putSsmParam} from '../common/util/ssm';
import {DataSource as DataSourceEntity} from '../common/util/ddb';

import {fnResp200, fnResp400, fnResp500} from '../common/util/response';

import config from '../common/config';

const {paramsPrefix = ''} = config;

const logInfo = (message: string, params: any = {}) => {
  const base = {type: 'DataSourcePut', message};
  console.info(JSON.stringify({...base, ...params}));
};

const logErr = (message: string, params: any = {}) => {
  const base = {type: 'DataSourcePut', message};
  console.error(JSON.stringify({...base, ...params}));
};

const parseDate = (date: string) => {
  const dt = Date.parse(date) || 0; // valid date string
  const valid = dt > Date.now(); // date is in the future
  return valid ? new Date(date) : '';
};

interface DataSourceArgs {
  event: any;
}

class DataSource {
  args: DataSourceArgs;
  props: any;
  paramMeta: any;

  constructor(args: DataSourceArgs) {
    this.args = args;
    this.props = this.defaultProps();
  }

  defaultProps() {
    const {event: {user, password, expires} = {}} = this.args;

    return {user, password, expires: parseDate(expires)};
  }

  get valid() {
    const {user, password, expires} = this.props;
    return !!(user && password && expires);
  }

  async putParam() {
    let err;
    let res;

    const {user, password} = this.props;
    const params = {Name: `${paramsPrefix}/${user}`, Value: password};

    try {
      res = await putSsmParam(params);
    } catch (error) {
      logErr('ssm param put failed', {error});
      err = error;
    }

    this.paramMeta = res;

    return err ? fnResp500([err]) : null;
  }

  // async putDataSource() {
  //   const {
  //     pk, sk, id, idx, url, uri, cat,
  //   } = this.props;

  //   const {
  //     duration,
  //     pixelDomains: pixels,
  //     adId: aid,
  //     creativeId: cid,
  //     creativeAdId: caid,
  //     mediaFiles: files,
  //   } = this;

  //   const item = {
  //     pk, sk, id, idx, url, uri, cat, duration, aid, cid, caid, pixels, files,
  //   };

  //   return DataSourceEntity.put(item);
  // }

  async put() {
    const {user, password, expires} = this.props;
    console.log('this.props: ', this.props);

    if (!this.valid) {
      logErr('invalid request', {
        user,
        expires,
        password: password ? '####' : null,
      });
      return fnResp400([{message: 'invalid request'}]);
    }

    const paramErrResp = await this.putParam();
    console.log('this.paramMeta: ', this.paramMeta);
    if (paramErrResp) {
      return paramErrResp;
    }

    return null;
  }
}

export const handler = async (event: any) => {
  console.log(JSON.stringify({...event, password: '####'})); // mask password

  const ds = new DataSource({event});

  return ds.put();
};
