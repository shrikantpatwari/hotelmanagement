import nodemailer from 'nodemailer';
import path from 'path';
import smtpTransport from 'nodemailer/lib/smtp-transport';
import { EMAIL_SERVICE_PROVIDER, EMAIL_SERVICE_HOST, EMAIL_SERVICE_AUTH_USER, EMAIL_SERVICE_AUTH_PASSWORD } from '@/config/config'
const hbs = require('nodemailer-express-handlebars')

class MailSender {
    transporter: any;
    constructor() {
        this.transporter = nodemailer.createTransport(
            new smtpTransport({
                service: EMAIL_SERVICE_PROVIDER,
                host: EMAIL_SERVICE_HOST,
                auth: {
                    user: EMAIL_SERVICE_AUTH_USER,
                    pass: EMAIL_SERVICE_AUTH_PASSWORD,
                },
            })
        );
        // point to the template folder
        const handlebarOptions = {
            viewEngine: {
                partialsDir: path.resolve('./views/'),
                defaultLayout: false,
            },
            viewPath: path.resolve('./views/'),
        };

        // use a template file with nodemailer
        this.transporter.use('compile', hbs(handlebarOptions))
    }

    sendMail(mailOptions: any) {
        this.transporter.sendMail(mailOptions, function(error: any, info: any){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    }
}

const MailService = new MailSender();

export default MailService;