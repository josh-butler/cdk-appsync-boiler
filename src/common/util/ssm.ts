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

// const listS3Keys = async (Bucket, Prefix) => {
//   let res;
//   let data = [];

//   try {
//     res = await listS3Objects(Bucket, Prefix);
//   } catch (e) {
//     console.error(e);
//   }

//   if (res) {
//     const { Contents = [] } = res;
//     data = Contents.filter(i => i.Size).map(i => i.Key);
//   }

//   return data;
// };

export {putSsmParam};
