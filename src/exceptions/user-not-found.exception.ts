import { HttpException, HttpStatus } from "@nestjs/common";

export class UserNotFoundException extends HttpException {
  constructor() {
    super('Not found user', HttpStatus.NOT_FOUND);
  }
}