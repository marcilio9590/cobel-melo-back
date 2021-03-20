import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PaginateModel } from 'mongoose-paginate-v2';
import { CustomerDTO } from "../dtos/customer.dto";
import { DuplicateUserException } from "../exceptions/duplica-user.exception";
import { CustomerDocument } from "../schemas/customer.schema";
import { UserDocument } from "../schemas/user.schema";
import { ProcessService } from "./process.service";

@Injectable()
export class CustomersService {

  constructor(
    @InjectModel('Customer') private readonly customerPaginateModel: PaginateModel<CustomerDocument>,
    @InjectModel('Customer') private readonly customerModel: Model<CustomerDocument>,
    private processService: ProcessService,

  ) { }

  async create(customerDTO: CustomerDTO): Promise<UserDocument> {
    const createdUser = await new this.customerPaginateModel(customerDTO);
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

  async getCustomers(page, size) {
    const options = {
      select: [
        '_id',
        'name',
        'email',
        'cpf',
        'phones',
        'address'
      ],
      page: page,
      limit: size,
    };
    try {
      return await this.customerPaginateModel.paginate({}, options);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteCustomer(customerId: string) {
    await this.customerPaginateModel.remove({ _id: customerId }, function (err) {
      if (!err) {
        return;
      }
      else {
        console.error("Ocorreu um erro ao processar sua requisição", err);
        throw err;
      }
    });
  }

  async update(customerId: string, customerDTO: CustomerDTO) {
    try {
      await this.customerPaginateModel.findByIdAndUpdate(customerId, customerDTO);
    } catch (error) {
      console.error("Ocorreu um erro ao processar sua requisição", error);
      throw error;
    }
  }

  async getCustomer(customerId: string) {
    try {
      return await this.customerPaginateModel.findById(customerId);
    } catch (error) {
      console.error("Ocorreu um erro ao processar sua requisição", error);
      throw error;
    }
  }

  async getCustomerProcess(customerId: string) {
    try {
      return await this.processService.getProcessByCustomer(customerId);
    } catch (error) {
      console.error("Ocorreu um erro ao processar sua requisição", error);
      throw error;
    }
  }

  async getCustomersByName(name: string) {
    try {
      return await this.customerModel.find({ name: { $regex: '.*' + name + '.*', $options: 'i' } }).select('_id name').exec();
    } catch (error) {
      console.error("Ocorreu um erro ao processar sua requisição", error);
      throw error;
    }
  }

}