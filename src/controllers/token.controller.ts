import { Controller, Get, HttpStatus, Post, Query, Res } from "@nestjs/common";
import { Response } from 'express';
import { Types } from "mongoose";
import { Result } from "../dtos/result.dto";
import { TokenService } from "../services/token.service";

@Controller('/v1/tokens')
export class TokensController {

  constructor(
    private tokenService: TokenService
  ) { }

  @Post('')
  async getToken(@Query('username') username, @Res() res: Response) {
    //TODO: Remover este userId e pegar do token
    await this.tokenService.getToken(username);
    res.status(HttpStatus.OK).send();
  }

  @Get('/validate')
  async validateToken(@Query('token') token, @Query('customerId') userId: string) {
    const result = await this.tokenService.validateToken(token, userId);
    return new Result(null, true, { isValid: result }, null);
  }

}