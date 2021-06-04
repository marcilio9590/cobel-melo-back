import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { PaginateModel } from 'mongoose-paginate-v2';
import { ProcessFilterTypes } from "../constants/process-filter-types.enum";
import { ProcessDTO } from "../dtos/create-process.dto";
import { ProcessDocument } from "../schemas/process.schema";
import { InstallmentsService } from "./installments.service";

@Injectable()
export class ProcessService {

  constructor(
    @Inject('PROCESS_MODEL') private readonly processPaginateModel: PaginateModel<ProcessDocument>,
    @Inject('PROCESS_MODEL') private readonly processModel: Model<ProcessDocument>,
    private installmentsService: InstallmentsService
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
      return await this.processModel.findById(processId).populate('customer processArea hearings installments').exec();
    } catch (error) {
      console.error("Ocorreu um erro ao processar sua requisição", error);
      throw error;
    }
  }

  async create(createProcessDTO: ProcessDTO) {
    let processSaved;
    try {
      const installmentsToSave = [...createProcessDTO.installments];
      createProcessDTO.installments = [];

      const createdProcess = await new this.processPaginateModel(createProcessDTO);
      processSaved = await createdProcess.save();

      if (installmentsToSave && installmentsToSave.length > 0) {
        const installmentsSaved = await this.installmentsService.createInstallments(processSaved.id, installmentsToSave);
        await this.processModel.findByIdAndUpdate(processSaved.id, { $push: { installments: { $each: installmentsSaved?.ops } } });
      }

    } catch (exception) {
      console.error("Ocorre um erro ao processar esta ação", exception);
      throw exception;
    }
    return processSaved;
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

      const installmentsToSave = [...processDTO.installments];
      processDTO.installments = [];

      await this.processPaginateModel.findByIdAndUpdate(id, processDTO);

      await this.installmentsService.removeInstallmentsByProcess(id);

      if (installmentsToSave && installmentsToSave.length > 0) {
        const installmentsSaved = await this.installmentsService.createInstallments(id, installmentsToSave);
        await this.processModel.findByIdAndUpdate(id, { $push: { installments: { $each: installmentsSaved?.ops } } });
      }

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

  async getCountProcessesByRangeDate(start: Date, finish: Date) {
    try {
      const result = await this.processModel.count({
        contractDate: {
          $gte: start,
          $lt: finish
        }
      }).exec();
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAvailableYears() {
    try {
      const result = await this.processModel.aggregate([
        { "$project": { "year": { "$year": "$createdAt" }, } },
        { "$group": { "_id": null, "years": { "$addToSet": { "description": "$year", "id": "$year" } } } }
      ]).exec();
      return result[0]?.years;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

}