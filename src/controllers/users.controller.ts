import { Body, Controller, HttpStatus, Post, Res, UseInterceptors } from "@nestjs/common";
import { Response } from 'express';
import { ResetPasswordContract } from "src/contracts/users/reset-password.contract";
import { CreateUserDTO } from "src/dtos/create-user.dto";
import { ResetPasswordDTO } from "src/dtos/reset-password.dto";
import { ValidatorInterceptor } from "src/interceptors/validator.interceptor";
import { UsersService } from "src/services/users.service";

@Controller('/v1/users')
export class UsersController {

  constructor(private usersService: UsersService) { }

  @Post()
  async create(@Body() userDTO: CreateUserDTO, @Res() res: Response): Promise<any> {
    await this.usersService.create(userDTO);
    res.status(HttpStatus.CREATED).send();
  }

  @Post('/reset-password')
  @UseInterceptors(new ValidatorInterceptor(new ResetPasswordContract()))
  async updatePassword(@Body() resetPasswordDTO: ResetPasswordDTO, @Res() res: Response): Promise<any> {
    await this.usersService.updatePassword(resetPasswordDTO);
    res.status(HttpStatus.OK).send();
  }

}