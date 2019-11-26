import * as nodemailer from 'nodemailer';
import config from '../config';
import { Logger } from '../logger';
import { EmailTemplate } from './types';
import { createUniqLink } from './operations';
import { agenda } from 'server/lib/agenda';
const hbs = require('nodemailer-express-handlebars');

export class Mailer {
  constructor(
    protected job: string,
    protected templateName: EmailTemplate,
    protected to: string[],
    protected subject: string,
    protected shortText?: string,
    protected from?: string,
    protected context?: { [key: string]: any }
  ) {
    this.init();
  }
  private transporter;

  private init = () => {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: config.GMAIL_USER,
        pass: config.GMAIL_APP_PASS
      }
    });

    this.to.forEach(emailAddress => {
      agenda.define(this.job + emailAddress, (job, done) => {
        const personal = this.context.personal;
        if (personal) {
          const personalData = this.context.data.find(d => d.email == emailAddress);
          this.sendMail(emailAddress, done, personalData);
        } else {
          this.sendMail(emailAddress, done);
        }
      });
    });
  };

  private handlebarOptions = {
    viewEngine: {
      extName: '.hbs',
      partialsDir: 'server/mails/views',
      layoutsDir: 'server/mails/views',
      defaultLayout: false
    },
    viewPath: 'server/mails/views',
    extName: '.hbs'
  };

  sendMail = async (
    to: string,
    done?: (err?: Error) => void,
    personalContext?: { [key: string]: any }
  ) => {
    try {
      this.transporter.use('compile', hbs(this.handlebarOptions));
      const unsubId = await createUniqLink(to);
      let info = await this.transporter.sendMail({
        from: `${this.from} <${config.GMAIL_USER}>`,
        to,
        subject: personalContext ? personalContext.subject : this.subject,
        text: this.shortText || '',
        template: personalContext ? personalContext.templateName : this.templateName,
        context: {
          ...(personalContext || this.context),
          unsubLink: `${config.SITE_URI}unsub/${unsubId}`
        }
      });
      Logger.debug('Message sent: ' + info.messageId);
      if (done) {
        done();
      }
    } catch (error) {
      Logger.error(error);
      if (done) {
        done(error);
      }
    }
  };

  performQueue = () => {
    this.to.forEach(emailAddress => agenda.now(this.job + emailAddress));
  };
}
