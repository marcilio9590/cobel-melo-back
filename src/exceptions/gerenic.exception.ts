import { HttpException, HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "../constants/error-codes.constants";

export class GenericException extends HttpException {
  constructor(
    public message: string,
    public errorCode: ErrorCodes,
    public statusCode: HttpStatus
  ) {
    super(message, statusCode);
  }
}