import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../dtos/jwt-payload';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class AuthService {

  constructor(private jwtService: JwtService) { }

  async createToken(user: UserDocument) {

    const payload: JwtPayload = {
      id: user._id,
      username: user.username,
      name: user.name.split(" ")[0],
      profileType: user.profileType
    };

    try {
      return { access_token: await this.jwtService.sign(payload), ...payload };
    } catch (error) {
      console.error("Ocorreu um erro ao processar sua requisição", error);
      throw error;
    }
  }

  decode(token: string) {
    return this.jwtService.decode(token);
  }

}