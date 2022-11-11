require('dotenv').config()
const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASSWORD, EMAIL_NAME, EMAIL_PORT } = process.env;
const { User } = require('../db/models');

module.exports = { 
    sendEmail: async(req, res, next) => {
        try { 
            // get the text from the body
            const { text, id } = req.body
            // get the user by primary key
            const user = User.findByPk(id);
            // set the transport for email
            const smtp = nodemailer.createTransport({
                name: EMAIL_NAME,
                port: EMAIL_PORT,
                auth: {
                    user: EMAIL_USER,
                    pass: EMAIL_PASSWORD,
                }
            });

            // set the mail content
            const mailOptions = {
                from: EMAIL_USER,
                to: user.email,// here insert the user email.
                subject: 'This is the Subject of the email Please Open it.',
                text: text
            }

            // send the mail content with error checks
            smtp.sendMail(mailOptions, (err, info) => {
                if (err) { 
                    return res.status(400).json({
                        message: `Cannot send email ${err}`
                    });
                } else { 
                    return res.status(200).json({
                        message: `Email sent into ${info.response}`
                    });
                }
            });
        } catch(err) {
            next(err);
        }
    }
}
