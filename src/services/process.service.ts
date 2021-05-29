import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { PaginateModel } from 'mongoose-paginate-v2';
import { ProcessFilterTypes } from "../constants/process-filter-types.enum";
import { ProcessDTO } from "../dtos/create-process.dto";
import { ProcessDocument } from "../schemas/process.schema";

@Injectable()
export class ProcessService {

  constructor(
    @Inject('PROCESS_MODEL') private readonly processPaginateModel: PaginateModel<ProcessDocument>,
    @Inject('PROCESS_MODEL') private readonly processModel: Model<ProcessDocument>
  ) { }

  async getProcessByCustomer(customerId: string) {
    try {
      return await this.processPaginateModel.find({ customer: customerId }).select('_id number description customer').exec();
    } catch (error) {
      console.error("Ocorreu um erro ao processar sua requisição", error);
      throw error;
    }
  }

  async getProcessDetail(processId: string) {
    try {
      return await this.processModel.findById(processId).populate('customer processArea hearings').exec();
    } catch (error) {
      console.error("Ocorreu um erro ao processar sua requisição", error);
      throw error;
    }
  }

  async create(createProcessDTO: ProcessDTO) {
    let response;
    try {
      const createdProcess = await new this.processPaginateModel(createProcessDTO);
      response = await createdProcess.save();
    } catch (exception) {
      console.error("Ocorre um erro ao processua esta ação", exception);
      throw exception;
    }
    return response;
  }

  async deleteMovement(id: string, movementId: string) {
    //TODO: Estudar como fazer este delete
    throw new Error("Method not implemented.");
  }

  async delete(id: string) {
    await this.processPaginateModel.remove({ _id: id }, function (err) {
      if (!err) {
        return;
      }
      else {
        console.error("Ocorreu um erro ao processar sua requisição", err);
        throw err;
      }
    });
  }

  async update(id: string, processDTO: ProcessDTO) {
    try {
      await this.processPaginateModel.findByIdAndUpdate(id, processDTO);
    } catch (error) {
      console.error("Ocorreu um erro ao processar sua requisição", error);
      throw error;
    }
  }

  async paginate(page, size, filterType: string, filterValue: string, isClosedProcesses: boolean) {
    const options = {
      populate: 'customer',
      select: [
        '_id',
        'customer',
        'description',
        'number',
        'valueOfCase'
      ],
      page: page,
      limit: size,
    };
    var filter = {
      [ProcessFilterTypes[filterType]]: filterValue,
      'closed': isClosedProcesses
    }
    if (ProcessFilterTypes.DESCRIPTION.toUpperCase() === filterType) {
      filter['description'] = new RegExp(filterValue, 'i');
    }
    try {
      return await this.processPaginateModel.paginate(filter, options);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

}