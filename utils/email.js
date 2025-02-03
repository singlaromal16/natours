const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');

// new Email(user, url).sendWelcome();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Romal Singla <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // Hotmail, Yaahoo, gmail, sendgrid
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      //  Activate in gmail "less secure app" option
    });
  }

  // Send the actual email
  async send(template, subject) {
    //1)Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    //2)Define email options

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };
    //3)Create a transport and send email

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
};

// const sendEmail = async (options) => {
//   console.log(options);

//   //1) Create a transporter
//   // const transporter = nodemailer.createTransport({
//   //   host: process.env.EMAIL_HOST, // Hotmail, Yaahoo
//   //   port: process.env.EMAIL_PORT,
//   //   auth: {
//   //     user: process.env.EMAIL_USERNAME,
//   //     pass: process.env.EMAIL_PASSWORD,
//   //   },
//   //   //  Activate in gmail "less secure app" option
//   // });

//   //2) Define the email options
//   const mailOptions = {
//     from: 'Romal Singla <singlaromal16@gmail.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };

//   //3) Actually send the email and it returns promises
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
