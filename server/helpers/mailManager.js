import ejs from 'ejs';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.APP_EMAIL_USERNAME,
    pass: process.env.APP_EMAIL_PASSWORD,
  },
});


let apiHost = 'http://localhost:3232';
if (process.env.NODE_ENV === 'production') apiHost = 'https://chidiebere-maintenance-api.herokuapp.com';

export default class MailManager {
  /**
     * Sends a mail to a using the options provided and calls a callback functio with
     * the result
     * @param {object} mailOptions an object containing the recipien,
     *  subject, text etc
     * @param {Function} callback this is called with a boolean indicating
     *  if the mail was sent or not
     */
  static send(mailOptions, callback) {
    transporter.sendMail(mailOptions, (error) => {
      const passed = !error;
      if (callback) callback(passed, error);
    });
  }


  /**
   * Sends a notification to the admin that a new request has been created.
   * This is done using an object that represents the request that was created and
   * a template in the htmlTemplate folder
   *
   * @param {object} request an object that contains info about the created object
   * @param {Function} callback  a callback function called with the result
   */
  static sendNewRequestNotification(request, callback) {
    const data = {
      emailTitle: 'A NEW REQUEST WAS CREATED',
      mailBody: 'A new request has just been created! You can start responding to it accordingly',
      request,
    };

    ejs.renderFile('./server/htmlTemplates/requestTemplate.ejs', data, (err, html) => {
      MailManager.send({
        from: 'Maintenance App <chidimaintenance@gmail.com>',
        to: process.env.ENGINEER_EMAIL || 'chidioguejiofor@gmail.com',
        subject: 'New Request Created',
        html,
      }, callback);
    });
  }

  /**
   * Sent to a client that with a specified mail confirming his requesst to signup
   * @param {S} email  the email of the client
   * @param {*} token  the token of the client
   * @param {*} callback  called with a boolean indicating if the mail was sent successufully
   */
  static confirmSignup(email, token, callback) {
    const data = {
      anchor: `${apiHost}/api/v1/auth/signup/${token}`,
    };

    ejs.renderFile('./server/htmlTemplates/signupTemplate.ejs', data, (err, html) => {
      MailManager.send({
        from: 'Maintenance App <chidimaintenance@gmail.com>',
        to: `${email}`,
        subject: 'SIGNUP CONFIRMATION',
        html,
      }, callback);
    });
  }

  /**
   * Sends a mail to the user confirming his request to reset his password
   * @param {*} email the email of the user
   * @param {*} token the password reset token
   * @param {*} callback  called with a boolean indicating if the mail was sent or not
   */
  static sendConfirmResetMail(email, token, callback) {
    const data = {
      anchor: `${apiHost}/api/v1/auth/reset/${token}`,
    };

    ejs.renderFile('./server/htmlTemplates/resetTemplate.ejs', data, (err, html) => {
      MailManager.send({
        from: 'Maintenance App <chidimaintenance@gmail.com>',
        to: `${email}`,
        subject: 'RESET PASSWORD',
        html,
      }, callback);
    });
  }

  /**
   * sends a mail to the engineer informing him that a client has just updated a request
   * @param {object} request  the new request details
   * @param {Function} callback  called with a boolean indicating if the mail was sent successfully
   */
  static sendUpdateRequestNotification(request, callback) {
    const data = {
      emailTitle: 'A  REQUEST WAS UPDATED',
      mailBody: 'A request was just updated!',
      request,
    };

    ejs.renderFile('./server/htmlTemplates/requestTemplate.ejs', data, (err, html) => {
      MailManager.send({
        from: 'Maintenance App <chidimaintenance@gmail.com>',
        to: process.env.ENGINEER_EMAIL || 'chidioguejiofor@gmail.com',
        subject: 'Request Update',
        html,
      }, callback);
    });
  }
}
