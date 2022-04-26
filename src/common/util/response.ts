// Sync Invoked Lambda Responses
const fnResp200 = (data: Object) => {
  return {code: 200, data};
};

const fnResp400 = (errors: Array<any>) => {
  return {code: 400, error: {errors}};
};

const fnResp500 = (errors: Array<any>) => {
  return {code: 400, error: {errors}};
};

export {fnResp200, fnResp400, fnResp500};
