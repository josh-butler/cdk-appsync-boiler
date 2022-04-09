const fs = require('fs');
const jwt = require('jsonwebtoken');

const privateKey = fs.readFileSync('keys/id_rsa');
const token = jwt.sign({role: 'admin'}, privateKey, {algorithm: 'RS256'});
console.log('token: ', token);
