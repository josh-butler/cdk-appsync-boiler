import axios from 'axios';

const logInfo = (message: string, params = {}) => {
  const base = {type: 'utilApi', message};
  console.info(JSON.stringify({...base, ...params}));
};

const parseErr = (err: any) => {
  const {response: {status = 500, statusText = 'Unknown'} = {}} = err;
  return {status, data: {error: {message: statusText}}};
};

const parseRes = (res: any) => {
  const {status, data} = res;
  return {status, data};
};

const parseResponse = ({res, err: e}: any) => {
  const data = res ? parseRes(res) : res;
  const err = e ? parseErr(e) : e;
  return {data, err};
};

const httpGet = async (url: string) => {
  let res;

  logInfo('HTTP GET', {url});
  try {
    res = await axios.get(url);
  } catch (e) {
    console.error(e);
  }

  const data = res ? res.data : null;

  return data;
};

// const httpPost = async (url: string, body: any) => {
//   let res;

//   logInfo('HTTP POST', {url});
//   try {
//     res = await axios.post(url, {data: body});
//   } catch (e) {
//     console.error(e);
//   }

//   const data = res ? res.data : null;

//   return data;
// };

const httpPost = async ({url, body, headers = {}}: any) => {
  let res;
  let err;

  logInfo('HTTP POST', {url});
  try {
    res = await axios.post(url, body, {headers});
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }
    err = e;
  }

  const data = res ? res.data : null;

  return {data, res, err};
};

const getJwks = async (url: string) => httpGet(url);

export {getJwks, httpGet, httpPost};
