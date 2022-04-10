const getSecret = async (client: any, SecretId: string) => {
  let res;
  let err;

  try {
    res = await client.getSecretValue({SecretId}).promise();
  } catch (e) {
    console.error(e);
    err = e;
  }

  const data = res ? res.SecretString : null;

  return {data, err};
};

const getSecretData = async (client: any, id: string) => {
  const {data} = await getSecret(client, id);
  return data;
};

export {getSecret, getSecretData};
