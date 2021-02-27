import { Body, Controller, Get, HttpStatus, Post, Query, Res, UseInterceptors } from "@nestjs/common";
import { Response } from 'express';
import { ResetPasswordContract } from "../contracts/users/reset-password.contract";
import { CreateUserDTO } from "../dtos/create-user.dto";
import { ResetPasswordDTO } from "../dtos/reset-password.dto";
import { Result } from "../dtos/result.dto";
import { ValidatorInterceptor } from "../interceptors/validator.interceptor";
import { TokenService } from "../services/token.service";
import { UsersService } from "../services/users.service";

@Controller('/v1/users')
export class UsersController {

  constructor(
    private usersService: UsersService,
    private tokenService: TokenService
  ) { }

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

  @Get('/token')
  async getToken(@Query('customerId') customerId) {
    const result = await this.tokenService.getToken(customerId);
    return new Result(null, true, { token: result }, null);
  }

  @Get('/token/validate')
  async validateToken(@Query('token') token, @Query('customerId') customerId: string) {
    const result = await this.tokenService.validateToken(token, customerId);
    return new Result(null, true, { isValid: result }, null);
  }

}