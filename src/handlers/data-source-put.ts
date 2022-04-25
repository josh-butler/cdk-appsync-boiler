import {putSsmParam} from '../common/util/ssm';

import {fnResp200, fnResp400} from '../common/util/response';

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

  // async putParam() {
  //   let err;
  //   let result;
  //   let data = [];
  //   const {user, password} = this.props;

  //   try {
  //     result = await EntityTable.query(GSI1pk, { index: 'GSI1' });
  //   } catch (e) {
  //     console.error(e);
  //     err = e;
  //   }

  //   if (result) {
  //     const { Items = [] } = result;
  //     const sorted = Items.sort((a, b) => b.modified - a.modified);
  //     data = sorted.map(imageAttrs);
  //   }

  //   return err ? resp500({ message: err.message }) : resp200(data);
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

    return null;
  }
}

export const handler = async (event: any) => {
  console.log(JSON.stringify({...event, password: '####'})); // mask password

  const ds = new DataSource({event});

  return ds.put();
};
