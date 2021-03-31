import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "../constants/error-codes.constants";
import { GenericException } from "./gerenic.exception";

export class UserNotFoundException extends GenericException {
  constructor() {
    super('Not found user', ErrorCodes.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}