import axios from 'axios';

const logInfo = (message: string, params = {}) => {
  const base = {type: 'edgeOidcApi', message};
  console.info(JSON.stringify({...base, ...params}));
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

const httpGetSecure = async (url: string, token: string) => {
  let res;

  const headers = {Authorization: `Bearer ${token}`};

  logInfo('HTTP GET secure', {url});
  try {
    res = await axios.get(url, {headers});
  } catch (e) {
    console.error(e);
  }

  const data = res ? res.data : null;

  return data;
};

const getIdpTokens = async ({url, params, headers}: any) => {
  let res;
  let err;

  logInfo('POST token code');
  try {
    res = await axios.post(url, params, {headers});
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }
    err = e;
  }

  const data = res ? res.data : null;

  return {data, res, err};
};

const getOidcCfg = async (url: string) => httpGet(url);

const getJwks = async (url: string) => httpGet(url);

const getUserInfo = async (url: string, token: string) =>
  httpGetSecure(url, token);

export {getJwks, getOidcCfg, httpGet, getIdpTokens, getUserInfo};
