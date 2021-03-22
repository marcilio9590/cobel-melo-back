import { Inject, Injectable } from "@nestjs/common";
import { PaginateModel } from 'mongoose-paginate-v2';
import { ResetPasswordDTO } from "../dtos/reset-password.dto";
import { UserDTO } from "../dtos/user.dto";
import { UserStatus } from "../enums/user-status.enum";
import { DuplicateUserException } from "../exceptions/duplica-user.exception";
import { UserAlreadyPasswordException } from "../exceptions/user-already-has-password.exception";
import { UserNotFoundException } from "../exceptions/user-not-found.exception";
import { UserDocument } from "../schemas/user.schema";

@Injectable()
export class UsersService {

  constructor(
    @Inject('USER_MODEL') private readonly userModel: PaginateModel<UserDocument>
  ) { }

  async create(createUserDTO: UserDTO): Promise<UserDocument> {
    createUserDTO.status = UserStatus.INITIAL;
    const createdUser = await new this.userModel(createUserDTO);
    let response;
    try {
      response = await createdUser.save()
    } catch (exception) {
      console.error("Ocorre um erro ao processua esta ação", exception);
      switch (exception.code) {
        case 11000:
          throw new DuplicateUserException();
        default:
          throw exception;
      }
    }
    return response;
  }

  async findByUsernamePassword(username, password): Promise<UserDocument> {
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
      .populate('-password')
      .exec();
  }

  async findById(userId: string): Promise<UserDocument> {
    const ObjectId = (require('mongoose').Types.ObjectId);
    return await this.userModel
      .findOne({
        '_id': new ObjectId(userId),
      })
      .populate('-password')
      .exec();
  }

  async saveFisrstPassword(resetPasswordDTO: ResetPasswordDTO) {
    const user = await this.findByUsername(resetPasswordDTO.username);
    if (!user) {
      throw new UserNotFoundException();
    } else if (user.password) {
      throw new UserAlreadyPasswordException();
    }
    return await this.userModel.findOneAndUpdate({
      username: resetPasswordDTO.username
    }, {
      password: resetPasswordDTO.password,
      status: UserStatus.ACTIVE
    });
  }

  async getUsers(page, size) {
    const options = {
      select: [
        '_id',
        'name',
        'username',
        'cpf',
        'profileType',
        'status'
      ],
      page: page,
      limit: size,
    };
    try {
      return await this.userModel.paginate({}, options);
    } catch (error) {
      console.error(error);
      throw error;

    }
  }

  async deleteUser(userId: string) {
    try {
      await this.userModel.findByIdAndUpdate(userId, { status: UserStatus.INACTIVE });
    } catch (error) {
      console.error("Ocorreu um erro ao processar sua requisição", error);
      throw error;
    }
  }

  async update(userId: string, userDTO: UserDTO) {
    try {
      await this.userModel.findByIdAndUpdate(userId, userDTO);
    } catch (error) {
      console.error("Ocorreu um erro ao processar sua requisição", error);
      throw error;
    }
  }

}