import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserNotFoundException } from "../exceptions/user-not-found.exception";
import { CreateUserDTO } from "../dtos/create-user.dto";
import { ResetPasswordDTO } from "../dtos/reset-password.dto";
import { UserStatus } from "../enums/user-status.enum";
import { DuplicateUserException } from "../exceptions/duplica-user.exception";
import { User, UserDocument } from "../schemas/user.schema";

@Injectable()
export class UsersService {

  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>
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

  async findByUsername(username: string): Promise<UserDocument> {
    return await this.userModel
      .findOne({
        username: username,
      })
      .exec();
  }

  async findById(userId: string): Promise<User> {
    const ObjectId = (require('mongoose').Types.ObjectId);
    return await this.userModel
      .findOne({
        '_id': new ObjectId(userId),
      })
      .exec();
  }

  async updatePassword(resetPasswordDTO: ResetPasswordDTO) {
    const user = await this.findByUsername(resetPasswordDTO.username);
    if (!user) {
      throw new UserNotFoundException();
    }
    return await this.userModel.findOneAndUpdate({
      username: resetPasswordDTO.username
    }, { password: resetPasswordDTO.password })
  }

}