import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { PaginateModel } from 'mongoose-paginate-v2';
import { ProcessDocument } from "../schemas/process.schema";

@Injectable()
export class ProcessService {

  constructor(
    @InjectModel('Process') private readonly processModel: PaginateModel<ProcessDocument>
  ) { }

  async getProcessByCustomer(customerId: string) {
    try {
      const options = {
        select: [
          '_id',
          'number',
          'description',
          'customer'
        ]
      };
      const ObjectId = (Types.ObjectId);
      return await this.processModel.find({ customer: new ObjectId(customerId) }, options).exec();
    } catch (error) {
      console.error("Ocorreu um erro ao processar sua requisição", error);
      throw error;
    }
  }

}