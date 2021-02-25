import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { Contract } from "src/contracts/contract";
import { Result } from "src/dtos/result.dto";

@Injectable()
export class ValidatorInterceptor implements NestInterceptor {

  constructor(public contract: Contract) {
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const body = req.body;
    const valid = this.contract.validate(body);
    if (!valid) {
      throw new HttpException(
        new Result('Ops, algo saiu errado',
          false,
          null,
          this.contract.errors),
        HttpStatus.BAD_REQUEST
      );
    }
    return next.handle();
  }
}