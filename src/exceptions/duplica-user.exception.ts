import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "../constants/error-codes.constants";
import { GenericException } from "./gerenic.exception";

export class DuplicateUserException extends GenericException {
  constructor() {
    super('The username already exists', ErrorCodes.DUPLICATED_USERNAME, HttpStatus.BAD_REQUEST);
  }
}