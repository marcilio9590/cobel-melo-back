import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { LoginDTO } from "../dtos/login.dto.ts";
import { UserStatus } from "../enums/user-status.enum";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { AuthService } from "../services/auth.service";
import { UsersService } from "../services/users.service";

@Controller('/v1/auth')
export class AuthController {

  constructor(private authService: AuthService, private usersService: UsersService) { }


  @Post()
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  async login(@Body() model: LoginDTO): Promise<any> {

    const user = await this.usersService.findByUsernamePassword(model.username, model.password);

    if (user.status === UserStatus.INITIAL) {
      throw new HttpException('Usuário com senha não cadastrada', HttpStatus.BAD_REQUEST);
    }

    const token = await this.authService.createToken(user);
    return token;
  }

}