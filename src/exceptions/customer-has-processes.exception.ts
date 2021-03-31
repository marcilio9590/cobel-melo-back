import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "../constants/error-codes.constants";
import { GenericException } from "./gerenic.exception";

export class CustomerHasProcessesException extends GenericException {
  constructor() {
    super('The customer has process', ErrorCodes.USER_HAS_PROCESSESS, HttpStatus.BAD_REQUEST);
  }
}