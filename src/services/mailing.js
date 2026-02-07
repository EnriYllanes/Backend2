import nodemailer from 'nodemailer';
import config from '../config/config.js';

export default class MailingService {
    constructor() {
        this.client = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: config.mailUser,
                pass: config.mailPass
            }
        });
    }

    sendMail = async ({ from, to, subject, html, attachments = [] }) => {
        let result = await this.client.sendMail({ from, to, subject, html, attachments });
        return result;
    };
}