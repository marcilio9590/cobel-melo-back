import { Controller, Headers, HttpStatus, Post, Query, Res } from "@nestjs/common";
import { Response } from 'express';
import { Result } from "../dtos/result.dto";
import { TokenService } from "../services/token.service";

@Controller('/v1/tokens')
export class TokensController {

  constructor(
    private tokenService: TokenService
  ) { }

  @Post('')
  async getToken(@Query('username') username, @Res() res: Response) {
    await this.tokenService.getToken(username);
    res.status(HttpStatus.OK).send();
  }

  @Post('/validate')
  async validateToken(@Headers() headers) {
    const result = await this.tokenService.validateTokenByUsername(headers['otp-token'], headers['username']);
    return new Result(null, true, { isValid: result }, null);
  }

}