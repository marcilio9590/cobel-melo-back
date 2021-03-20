import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PaginateModel } from 'mongoose-paginate-v2';
import { CreateProcessDTO } from "../dtos/create-process.dto";
import { ProcessDocument } from "../schemas/process.schema";

@Injectable()
export class ProcessService {

  constructor(
    @InjectModel('Process') private readonly processModel: PaginateModel<ProcessDocument>
  ) { }

  async getProcessByCustomer(customerId: string) {
    try {
      return await this.processModel.find({ customer: customerId }).select('_id number description customer').exec();
    } catch (error) {
      console.error("Ocorreu um erro ao processar sua requisição", error);
      throw error;
    }
  }

  async getProcessDetail(processId: string) {
    try {
      return await this.processModel.findById(processId).populate('customer').exec();
    } catch (error) {
      console.error("Ocorreu um erro ao processar sua requisição", error);
      throw error;
    }
  }

  async create(createProcessDTO: CreateProcessDTO) {
    let response;
    try {
      const createdProcess = await new this.processModel(createProcessDTO);
      response = await createdProcess.save()
    } catch (exception) {
      console.error("Ocorre um erro ao processua esta ação", exception);
      throw exception;
    }
    return response;
  }

}