import {putSsmParam} from '../common/util/ssm';
import {base64, ddbMarshal} from '../common/util/util';
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

class DataSourcePut {
  args: DataSourceArgs;
  props: any;
  paramMeta: any;

  constructor(args: DataSourceArgs) {
    this.args = args;
    this.props = this.defaultProps();
  }

  defaultProps() {
    const {event: {user, password, expires, description: desc} = {}} =
      this.args;

    const uid = user;
    const pk = `DATASOURCE#${uid}`;
    const id = base64(JSON.stringify(ddbMarshal({pk, sk: pk})));
    const isoDate = parseDate(expires);
    const paramName = `${paramsPrefix}/${user}`;

    return {id, pk, user, desc, password, paramName, expires: isoDate};
  }

  get valid() {
    const {user, password, expires} = this.props;
    return !!(user && password && expires);
  }

  get paramId() {
    const {paramName} = this.props;
    const {Version = 0} = this.paramMeta;
    return `${paramName}:${Version}`;
  }

  async putParam() {
    let err;
    let res;

    const {paramName: Name, password} = this.props;

    logInfo('ssm param put', {Name});
    try {
      res = await putSsmParam({Name, Value: password});
    } catch (error) {
      logErr('ssm param put failed', {error});
      err = error;
    }

    this.paramMeta = res;

    return err ? fnResp500([err]) : null;
  }

  async putDataSource() {
    const {pk, id, uid, desc} = this.props;
    let err;

    const item = {
      pk,
      sk: pk,
      GSI1sk: pk,
      id,
      uid,
      desc,
      param: this.paramId,
    };

    logInfo('ddb put', {item});

    try {
      await DataSourceEntity.put(item);
    } catch (error) {
      logErr('ddb put failed', {error});
      err = error;
    }

    return err
      ? fnResp500([err])
      : fnResp200({message: 'data source entity updated', item});
  }

  async put() {
    const {user, password, expires} = this.props;

    if (!this.valid) {
      logErr('invalid parameters', {
        user,
        expires,
        password: password ? '####' : null,
      });
      return fnResp400([{message: 'invalid request'}]);
    }

    const paramErrResp = await this.putParam();
    if (paramErrResp) {
      return paramErrResp;
    }

    return this.putDataSource();
  }
}

export const handler = async (event: any) => {
  console.log(JSON.stringify({...event, password: '####'})); // mask password

  const ds = new DataSourcePut({event});

  return ds.put();
};
