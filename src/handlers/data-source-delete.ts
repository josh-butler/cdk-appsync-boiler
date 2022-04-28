import {deleteSsmParam} from '../common/util/ssm';
import {DataSource as DataSourceEntity} from '../common/util/ddb';
import {fnResp200, fnResp400, fnResp500} from '../common/util/response';

import config from '../common/config';

const {paramsPrefix = ''} = config;

const logInfo = (message: string, params: any = {}) => {
  const base = {type: 'DataSourceDelete', message};
  console.info(JSON.stringify({...base, ...params}));
};

const logErr = (message: string, params: any = {}) => {
  const base = {type: 'DataSourceDelete', message};
  console.error(JSON.stringify({...base, ...params}));
};

interface DataSourceArgs {
  event: any;
}

class DataSourceDelete {
  args: DataSourceArgs;
  props: any;

  constructor(args: DataSourceArgs) {
    this.args = args;
    this.props = this.defaultProps();
  }

  defaultProps() {
    const {event: {user} = {}} = this.args;

    const uid = user;
    const pk = `DATASOURCE#${uid}`;
    const paramName = `${paramsPrefix}/${user}`;

    return {pk, user, paramName};
  }

  get valid() {
    const {user} = this.props;
    return !!user;
  }

  async deleteParam() {
    let err;

    const {paramName: Name} = this.props;

    logInfo('ssm param delete', {Name});
    try {
      await deleteSsmParam({Name});
    } catch (error) {
      logErr('ssm param delete failed', {error});
      err = error;
    }

    return err ? fnResp500([err]) : null;
  }

  async deleteDataSource() {
    const {pk} = this.props;
    let err;

    const item = {pk, sk: pk};

    logInfo('ddb delete', {item});

    try {
      await DataSourceEntity.delete(item);
    } catch (error) {
      logErr('ddb delete failed', {error});
      err = error;
    }

    return err
      ? fnResp500([err])
      : fnResp200({message: 'data source entity deleted', item});
  }

  async delete() {
    const {user} = this.props;

    if (!this.valid) {
      logErr('invalid request', {user});
      return fnResp400([{message: 'invalid request'}]);
    }

    const paramErrResp = await this.deleteParam();
    if (paramErrResp) {
      return paramErrResp;
    }

    return this.deleteDataSource();
  }
}

export const handler = async (event: any) => {
  console.log(JSON.stringify({...event, password: '####'})); // mask password

  const ds = new DataSourceDelete({event});

  return ds.delete();
};
