import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDTO } from "../dtos/create-user.dto";
import { EmailDTO } from "../dtos/email.dto";
import { ResetPasswordDTO } from "../dtos/reset-password.dto";
import { UserStatus } from "../enums/user-status.enum";
import { DuplicateUserException } from "../exceptions/duplica-user.exception";
import { User, UserDocument } from "../schemas/user.schema";
import { MailClient } from "./send-grid.service";

@Injectable()
export class UsersService {

  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private mailClient: MailClient,
    private configService: ConfigService
  ) { }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    createUserDTO.status = UserStatus.INITIAL;
    const createdUser = await new this.userModel(createUserDTO);
    let response;
    try {
      response = await createdUser.save()
    } catch (exception) {
      switch (exception.code) {
        case 11000:
          throw new DuplicateUserException();
        default:
          throw exception;
      }
    }
    return response;
  }

  async findByUsernamePassword(username, password): Promise<User> {
    return await this.userModel
      .findOne({
        username: username,
        password: password
      })
      .exec();
  }

  async findByUsername(username): Promise<User> {
    return await this.userModel
      .findOne({
        username: username,
      })
      .exec();
  }

  async updatePassword(resetPasswordDTO: ResetPasswordDTO) {
    // const user = await this.findByUsername(resetPasswordDTO.username);
    // if (!user) {
    //   throw new UserNotFoundException();
    // }
    // return await this.userModel.findOneAndUpdate({
    //   username: resetPasswordDTO.username
    // }, { password: resetPasswordDTO.password })
    const templateId = this.configService.get<string>('SEND_GRID_RESET_PASSWORD_TEMPLATE');
    const mail = new EmailDTO('marcilio9590@gmail.com', templateId, { 'token': '123456' });
    this.mailClient.sendEmail(mail);
  }

}