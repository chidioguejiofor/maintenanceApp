import jwt from 'jsonwebtoken';

const secretKey = process.env.secretKey || 'secretKey';
class Authenticator {
  static createToken(payload, expires, callback) {
    jwt.sign(payload, secretKey, { expiresIn: expires }, (err, token) => {
      callback(err, token);
    });
  }

  static verifyToken(req, resp, next) {
    const token = req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          resp.status(401).json({
            success: false,
            message: 'The token you provided was invalid',
          });
        } else {
          req.authData = decoded;
          next();
        }
      });
    } else {
      resp.status(401).json({
        success: false,
        message: 'Authorization token was not included in your request. Put this in the header parameter x-access-token',
      });
    }
  }
}


export default Authenticator;
