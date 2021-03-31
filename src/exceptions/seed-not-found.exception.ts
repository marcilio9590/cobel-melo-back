import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "../constants/error-codes.constants";
import { GenericException } from "./gerenic.exception";

export class SeedNotFoundException extends GenericException {
  constructor() {
    super('Seed not found for user', ErrorCodes.SEED_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}