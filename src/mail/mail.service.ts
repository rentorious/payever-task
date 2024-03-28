import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor() {}

  async send(email: string, subject: string, message: string) {
    const transporter = nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
    });

    const mailOptions = {
      from: 'app@example.com',
      to: email,
      subject: subject,
      text: message,
    };

    return (await transporter.sendMail(mailOptions)).messageId;
  }
}
