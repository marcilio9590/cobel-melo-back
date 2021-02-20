import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { Response } from 'express';
import { CreateUserDTO } from "src/dtos/create-user.dto";
import { UsersService } from "src/services/users.service";

@Controller('/v1/users')
export class UsersController {

  constructor(private usersService: UsersService) { }

  @Post()
  async create(@Body() userDTO: CreateUserDTO, @Res() res: Response): Promise<any> {
    await this.usersService.create(userDTO);
    res.status(HttpStatus.CREATED).send();
  }

}