import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { totp } from 'otplib';
import { SeedNotFoundException } from '../exceptions/seed-not-found.exception';
import { Seed, SeedDocument } from '../schemas/seed.schema';

@Injectable()
export class TokenService {

  private secret: string = 'gOXzEcx1azsYf6NUGL5ldxOfvmCbl6kh';
  private ObjectId = (require('mongoose').Types.ObjectId);

  constructor(@InjectModel('Seed') private readonly seedModel: Model<SeedDocument>) {
    totp.options = {
      step: 30,
      window: 3,
    }
  }

  async getToken(userId: string): Promise<string> {
    let seed = await this.getSeedByUserId(userId);
    if (!seed) {
      const secret = this.secret.concat(userId);
      seed = await this.saveSeed(userId, secret);
    }
    return totp.generate(seed.secret);
  }

  async validateToken(token: string, userId: string): Promise<boolean> {
    let seed = await this.getSeedByUserId(userId);
    if (!seed) {
      throw new SeedNotFoundException();
    }
    return totp.check(token, seed.secret);
  }

  async getSeedByUserId(userId: string): Promise<Seed> {
    return await this.seedModel
      .findOne({
        'user': new this.ObjectId(userId)
      })
      .exec();
  }

  async saveSeed(userId: string, secret: string) {
    const createdSeed = await new this.seedModel({ secret: secret, user: userId });
    return await createdSeed.save();
  }

}