import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from "@nestjs/common";
import { LoginDTO } from "src/dtos/login.dto.ts";
import { UserStatus } from "src/enums/user-status.enum";
import { AuthService } from "src/services/auth.service";
import { UsersService } from "src/services/users.service";

@Controller('/v1/auth')
export class AuthController {

  constructor(private authService: AuthService, private usersService: UsersService) { }


  @Post()
  @HttpCode(200)
  async login(@Body() model: LoginDTO): Promise<any> {
    const user = await this.usersService.findByUsernamePassword(model.username, model.password);

    if (!user) {
      throw new HttpException('Usuário ou senha inválidos', HttpStatus.UNAUTHORIZED);
    }

    if (user.status === UserStatus.INITIAL) {
      throw new HttpException('Usuário com senha não cadastrada', HttpStatus.BAD_REQUEST);
    }

    const token = await this.authService.createToken(user);
    return token;
  }

}