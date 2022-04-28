import {SSM} from 'aws-sdk';

const ssm = new SSM({apiVersion: '2014-11-06'});

const putSsmParam = async ({Name = '', Value = ''}) => {
  const params = {
    Name,
    Value,
    Overwrite: true,
    Type: 'String', // 'SecureString',
  };
  return ssm.putParameter(params).promise();
};

const deleteSsmParam = async ({Name = ''}) => {
  return ssm.deleteParameter({Name}).promise();
};

export {deleteSsmParam, putSsmParam};
