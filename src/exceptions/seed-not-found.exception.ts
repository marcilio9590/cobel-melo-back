import { HttpException, HttpStatus } from "@nestjs/common";

export class SeedNotFoundException extends HttpException {
  constructor() {
    super('Seed not found for user', HttpStatus.NOT_FOUND);
  }
}