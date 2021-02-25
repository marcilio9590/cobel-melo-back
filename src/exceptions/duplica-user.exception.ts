import { HttpException, HttpStatus } from "@nestjs/common";

export class DuplicateUserException extends HttpException {
  constructor() {
    super('The username already exists', HttpStatus.BAD_REQUEST);
  }
}