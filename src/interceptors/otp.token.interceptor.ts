import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserDocument } from "src/schemas/user.schema";
import { ResetPasswordDTO } from "../dtos/reset-password.dto";
import { Result } from "../dtos/result.dto";
import { TokenService } from "../services/token.service";
import { UsersService } from "../services/users.service";

@Injectable()
export class OtpTokenInterceptor implements NestInterceptor {

  constructor(
    private tokenService: TokenService,
    private userService: UsersService
  ) { }

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const body: ResetPasswordDTO = req.body;

    //TODO: Remover esta logica e passar a pegar o id do usuario através do token
    try {
      const user: UserDocument = await this.userService.findByUsername(body.username);
      const valid = await this.tokenService.validateToken(req.headers["otp-token"], user._id.toString());
      // const valid = false;
      if (!valid) {
        throw new HttpException(
          new Result('OTP token is invalid',
            false,
            null,
            null),
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      console.error(error);
      throw error;
    }

    return next.handle();
  }
}