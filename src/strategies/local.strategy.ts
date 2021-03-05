import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserStatus } from '../enums/user-status.enum';
import { UsersService } from '../services/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsernamePassword(username, password);
    if (!user || user?.status == UserStatus.INACTIVE) {
      throw new HttpException('Usuário ou senha inválidos', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}