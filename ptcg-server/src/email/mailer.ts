import { createTransport } from 'nodemailer';

import { EmailTemplate } from './email-template';
import { config } from '../config';

export class Mailer {

  public async sendEmail(
    email: string,
    template: EmailTemplate,
    params: {[key: string]: string}
  ): Promise<void> {

    const transportOptions: any = config.email.transporter;
    const transporter = createTransport(transportOptions);

    let subject = template.subject;
    let text = template.body;

    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        subject = subject.replace('{' + key + '}', params[key]);
        text = text.replace('{' + key + '}', params[key]);
      }
    }

    const from = config.email.sender;
    const to = email;
    await transporter.sendMail({ from, to, subject, text });
  }

}
