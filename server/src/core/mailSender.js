const cron = require('cron');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const {formatString} = require('../utils/stringUtils')

module.exports = class MailSender {
    maxRetries = 4;
    bufferSize = 100;
    templates = {}
    failedEmails = {}

    constructor(config = {}) {
        let templatesDir = path.join(__dirname, '../../mailTemplates');

        fs.readdirSync(templatesDir).forEach(file => {
            if (file.endsWith('.html')) {
                this.templates[file.slice(0, -5)] = fs.readFileSync(path.join(templatesDir, file), 'utf8');
            }
        })

        this.transporter = nodemailer.createTransport({
            service: config.mailService,
            auth: {
                user: config.mailUser,
                pass: config.mailPass
            }
        })

        this.cronJob = new cron.CronJob('* */3 * * * *', () => {
            // Check for failed emails every 3 minutes
            for (const [key, value] of Object.entries(this.failedEmails)) {
                this.sendMail(key, value.subject, value.templateName, ...value.args);
            }
        }, null, true, 'Europe/Paris');
    }

    sendMail(to, subject, templateName, ...args) {
        this.transporter.sendMail({
            from: this.transporter.options.auth.user,
            to: to,
            subject: subject,
            html: formatString(this.templates[templateName], ...args)
        }, (err, _) => {
            if (err && Object.keys(this.failedEmails).length < this.bufferSize) {
                let element = this.failedEmails[to];

                if (element === undefined) {
                    this.failedEmails[to] = {
                        subject: subject,
                        templateName: templateName,
                        args: args,
                        retries: 0
                    }
                } else {
                    element.retries++;
                    if (element.retries >= this.maxRetries) {
                        delete this.failedEmails[to];
                    }
                }
            }
        })
    }
}
