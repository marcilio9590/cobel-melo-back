import { Controller, Headers, HttpStatus, Post, Query, Res, UseGuards } from "@nestjs/common";
import { Response } from 'express';
import { Result } from "../dtos/result.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { TokenService } from "../services/token.service";

@Controller('/v1/tokens')
export class TokensController {

  constructor(
    private tokenService: TokenService
  ) { }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async getToken(@Query('username') username, @Res() res: Response) {
    await this.tokenService.getToken(username);
    res.status(HttpStatus.OK).send();
  }

  @Post('/validate')
  @UseGuards(JwtAuthGuard)
  async validateToken(@Headers() headers) {
    const result = await this.tokenService.validateTokenByUsername(headers['otp-token'], headers['username']);
    return new Result(null, true, { isValid: result }, null);
  }

}