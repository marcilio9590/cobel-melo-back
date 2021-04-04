import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import { Response } from 'express';
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { ResetPasswordContract } from "../contracts/users/reset-password.contract";
import { Profile } from "../decorators/profiles.decorator";
import { ResetPasswordDTO } from "../dtos/reset-password.dto";
import { Result } from "../dtos/result.dto";
import { UserDTO } from "../dtos/user.dto";
import { ProfileTypes } from "../enums/profiles.enum";
import { OtpTokenInterceptor } from "../interceptors/otp.token.interceptor";
import { ValidatorInterceptor } from "../interceptors/validator.interceptor";
import { UsersService } from "../services/users.service";

@Controller('/v1/users')
export class UsersController {

  constructor(
    private usersService: UsersService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Profile([ProfileTypes.ADMIN, ProfileTypes.EDIT])
  async create(@Body() userDTO: UserDTO, @Res() res: Response): Promise<any> {
    await this.usersService.create(userDTO);
    res.status(HttpStatus.CREATED).send();
  }

  @Put('/:userId')
  @UseGuards(JwtAuthGuard)
  @Profile([ProfileTypes.ADMIN, ProfileTypes.EDIT])
  async update(@Param('userId') userId: string, @Body() userDTO: UserDTO, @Res() res: Response): Promise<any> {
    await this.usersService.update(userId, userDTO);
    res.status(HttpStatus.OK).send();
  }

  @Post('/first-password')
  @UseInterceptors(OtpTokenInterceptor, new ValidatorInterceptor(new ResetPasswordContract()))
  async saveFisrstPassword(@Body() resetPasswordDTO: ResetPasswordDTO, @Res() res: Response): Promise<any> {
    await this.usersService.saveFisrstPassword(resetPasswordDTO);
    res.status(HttpStatus.OK).send();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(@Res() res: Response, @Query('page') page: Number, @Query('size') size: Number): Promise<any> {
    const users = await this.usersService.getUsers(page, size);
    const result = new Result('', true, users, null);
    res.status(HttpStatus.PARTIAL_CONTENT).send(result);
  }

  @Delete('/:userId')
  @UseGuards(JwtAuthGuard)
  @Profile([ProfileTypes.ADMIN, ProfileTypes.EDIT])
  async deleteUser(@Res() res: Response, @Param('userId') userId: string): Promise<any> {
    await this.usersService.deleteUser(userId);
    res.status(HttpStatus.NO_CONTENT).send();
  }

}