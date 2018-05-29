export default class Controller {
  static verifyUser(req, resp, userType) {
    if (!req.authData[userType]) {
      resp.status(403).json({
        success: false,
        message: `Only ${userType}(s) can make a request`,
      });
      return false;
    }
    return true;
  }
}
