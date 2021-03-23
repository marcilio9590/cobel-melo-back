import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import { totp } from 'otplib';
import { UserStatus } from '../enums/user-status.enum';
import { UserAlreadyPasswordException } from '../exceptions/user-already-has-password.exception';
import { otpConstants } from '../constants/constants';
import { EmailDTO } from '../dtos/email.dto';
import { SeedNotFoundException } from '../exceptions/seed-not-found.exception';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { Seed, SeedDocument } from '../schemas/seed.schema';
import { MailClient } from './send-grid.service';
import { UsersService } from './users.service';

@Injectable()
export class TokenService {

  constructor(
    @Inject('SEED_MODEL') private readonly seedModel: Model<SeedDocument>,
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
    try {
      const user = await this.userService.findByUsername(username);
      if (!user) {
        throw new UserNotFoundException();
      }

      if (user.status != UserStatus.INITIAL) {
        throw new UserAlreadyPasswordException();
      }

      let seed = await this.getSeedByUserId(user._id.toString());
      if (!seed) {
        const secret = otpConstants.secret.concat(user._id);
        seed = await this.saveSeed(user._id, secret);
      }
      const token = totp.generate(seed.secret);
      this.sendEmailWithToken(token, user.username);
      return token;
    } catch (error) {
      console.error("Ocorreu um erro ao processar esta ação", error);
      throw error;
    }
  }

  async validateToken(token: string, userId: string): Promise<boolean> {
    let seed = await this.getSeedByUserId(userId);
    if (!seed) {
      throw new SeedNotFoundException();
    }
    return totp.check(token, seed.secret);
  }

  async validateTokenByUsername(token: string, username: string): Promise<boolean> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UserNotFoundException();
    }
    let seed = await this.getSeedByUserId(user._id.toString());
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