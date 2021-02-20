import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {

  createToken(user: User) {
    console.log("AuthService.createToken - Info - Pending JWT implementation");
    return user;
  }

}