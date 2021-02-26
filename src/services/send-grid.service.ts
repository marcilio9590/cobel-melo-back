import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { EmailDTO } from 'src/dtos/email.dto';

@Injectable()
export class MailClient {

  constructor(private configService: ConfigService) {
    // const key = this.configService.get<string>('SEND_GRID_KEY');
    const key = process.env.ENV_SEND_GRID_KEY;
    sgMail.setApiKey(key);
  }

  sendEmail(mail: EmailDTO) {
    const msg = {
      to: mail.to,
      from: this.configService.get<string>('SEND_GRID_FROM'),
      templateId: mail.templateId,
      dynamic_template_data: mail.variables
    }

    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })

  }

}