import { HttpException, HttpStatus } from "@nestjs/common";

export class DuplicateUserException extends HttpException {
  constructor() {
    super('The username exists', HttpStatus.BAD_REQUEST);
  }
}