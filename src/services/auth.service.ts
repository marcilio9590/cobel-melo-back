import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class AuthService {

  constructor(private jwtService: JwtService) { }

  createToken(user: UserDocument) {
    const payload = {
      id: user._id,
      username: user.username,
      name: user.name.split(" ")[0]
    }
    return { access_token: this.jwtService.sign(payload), ...payload };
  }

}