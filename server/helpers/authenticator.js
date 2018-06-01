import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY || 'secretKey';

/**
 * An authenticator contains static functions for creating and managing
 * token based authentification implemented in the app.
 */
class Authenticator {
  /**
   * This creates a token using a payload and calls the result on the callback
   * @param {object} payload an object that contains information to be tokenized
   * @param {string} expires a string containing the expiry date of the token
   * @param {function callback(err, token) {
     called with an error object and token. The callback should handle both
     error and token.
   }}
   */
  static createToken(payload, expires, callback) {
    jwt.sign(payload, secretKey, { expiresIn: expires }, (err, token) => {
      callback(err, token);
    });
  }

  /**
   * This middleware function checks if a token exists. If it does it decodes it
   * and adds the decoded object to the req object via authData property and calls the
   * next function. 
   * If the verification fails it returns a 403 "Forbidden" status to the user
   * and appropriate error messsage
   * @param {object} req a request object
   * @param {object} resp the response object
   * @param {function} next called when the verification passes 
   */
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
