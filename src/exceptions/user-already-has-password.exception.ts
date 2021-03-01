import { HttpException, HttpStatus } from "@nestjs/common";

export class UserAlreadyPasswordException extends HttpException {
  constructor() {
    super('User already password', HttpStatus.BAD_REQUEST);
  }
}