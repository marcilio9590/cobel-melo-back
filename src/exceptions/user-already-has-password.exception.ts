import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "../constants/error-codes.constants";
import { GenericException } from "./gerenic.exception";

export class UserAlreadyPasswordException extends GenericException {
  constructor() {
    super('User already password', ErrorCodes.USER_ALREADY_PASSWORD, HttpStatus.BAD_REQUEST);
  }
}