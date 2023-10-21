const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const fs = require("fs");

module.exports = class Email {
  constructor({ mailto, user, resetUrl, EMAIL_USERNAME }) {
    this.to = mailto;
    this.user = user;
    this.url = resetUrl;
    this.from = `Ok web <${EMAIL_USERNAME}>`;
  }

  newTransport({ EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USERNAME,
    EMAIL_PASSWORD }) {
    return nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  // Send the actual email
  async send({ template,
    title,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USERNAME,
    EMAIL_PASSWORD
  }) {
    // 1) Render HTML based on a pug template
    // const html = fs.readFileSync(`./${template}.html`);
    const html = template;

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: title,
      html,
      text: htmlToText.fromString(html)
    };

    // 3) Create a transport and send email
    await this.newTransport({
      EMAIL_HOST,
      EMAIL_PORT,
      EMAIL_USERNAME,
      EMAIL_PASSWORD
    }).sendMail(mailOptions);
  }
};