const fs = require('fs');
const jwt = require('jsonwebtoken');

const publicKey = fs.readFileSync('keys/id_rsa.pub');
const token = '';

const decoded = jwt.verify(token, publicKey);
console.log(decoded);
