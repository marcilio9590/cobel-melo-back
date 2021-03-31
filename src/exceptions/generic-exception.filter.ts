import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCodes } from '../constants/error-codes.constants';
import { ResultError } from '../dtos/result-error.dto';
import { GenericException } from './gerenic.exception';

@Catch(GenericException)
export class GenericExceptionFilter implements ExceptionFilter {
  catch(exception: GenericException, host: ArgumentsHost) {
    console.error("GenericException.catch - Error - ", exception.getResponse())
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json(
        new ResultError(exception.message, null, ErrorCodes[exception.errorCode])
      );
  }
}