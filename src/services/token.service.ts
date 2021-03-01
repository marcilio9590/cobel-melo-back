import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { totp } from 'otplib';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { EmailDTO } from '../dtos/email.dto';
import { SeedNotFoundException } from '../exceptions/seed-not-found.exception';
import { Seed, SeedDocument } from '../schemas/seed.schema';
import { MailClient } from './send-grid.service';
import { UsersService } from './users.service';

@Injectable()
export class TokenService {

  //TODO: Substituir por variavel de ambiente
  private secret: string = 'gOXzEcx1azsYf6NUGL5ldxOfvmCbl6kh';

  constructor(
    @InjectModel('Seed') private readonly seedModel: Model<SeedDocument>,
    private mailClient: MailClient,
    private configService: ConfigService,
    private userService: UsersService
  ) {
    totp.options = {
      step: 30,
      window: 3,
    }
  }

  async getToken(username: string): Promise<string> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UserNotFoundException();
    }
    let seed = await this.getSeedByUserId(user._id.toString());
    if (!seed) {
      const secret = this.secret.concat(username);
      seed = await this.saveSeed(username, secret);
    }
    const token = totp.generate(seed.secret);
    this.sendEmailWithToken(token, user.username);
    return token;
  }

  async validateToken(token: string, userId: string): Promise<boolean> {
    let seed = await this.getSeedByUserId(userId);
    if (!seed) {
      throw new SeedNotFoundException();
    }
    return totp.check(token, seed.secret);
  }

  async getSeedByUserId(userId: string): Promise<Seed> {
    const ObjectId = (Types.ObjectId);
    return await this.seedModel
      .findOne({
        'user': new ObjectId(userId)
      })
      .exec();
  }

  async saveSeed(userId: string, secret: string) {
    const createdSeed = await new this.seedModel({ secret: secret, user: userId });
    return await createdSeed.save();
  }

  async sendEmailWithToken(token: string, email: string) {
    const templateId = this.configService.get<string>('SEND_GRID_RESET_PASSWORD_TEMPLATE');
    const mail = new EmailDTO(email, templateId, { 'token': token });
    this.mailClient.sendEmail(mail);
  }

}