import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DecodeTokenDTO } from '../dtos/decode-token.dto';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class AuthService {

  constructor(private jwtService: JwtService) { }

  createToken(user: UserDocument) {
    const payload = new DecodeTokenDTO(user._id, user.username, user.name.split(" ")[0], user.profileType);
    try {
      return { access_token: this.jwtService.sign({ payload }), ...payload };
    } catch (error) {
      console.error("Ocorreu um erro ao processar sua requisição", error);
      throw error;
    }
  }

  decode(token: string) {
    return this.jwtService.decode(token);
  }

}