import jwt from 'jsonwebtoken';

class Authenticator {
  constructor() {
    this.secretKey = process.env.secretKey || 'secretKey';
  }

  createToken(payload, expires, callback) {
    jwt.sign(payload, this.secretKey, { expiresIn: expires }, (err, token) => {
      callback(err, token);
    });
  }

  verifyToken(token, callback) {
    jwt.verify(token, this.secretKey, (err, decoded) => {
      callback(err, decoded);
    });
  }
}


export default new Authenticator();
