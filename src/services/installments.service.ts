import { Inject, Injectable } from "@nestjs/common";
import { Model, ObjectId } from "mongoose";
import { InstallmentDocument } from "src/schemas/installment.schema";
import { InstallmentsDTO } from "../dtos/installments.dto";

@Injectable()
export class InstallmentsService {

  constructor(
    @Inject('INSTALLMENT_MODEL') private readonly installmentModel: Model<InstallmentDocument>
  ) { }

  async createInstallments(processId: ObjectId, installments: InstallmentsDTO[]) {
    installments.forEach((i) => {
      i.process = processId;
    });
    const saved = await this.installmentModel.collection.insertMany(installments);
    return saved;
  }

  async removeInstallmentsByProcess(processId) {
    try {
      const result = await this.installmentModel.remove({ "process": processId }).exec();
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getInstallmentsByRangeDate(startDate: Date, finishDate: Date) {
    try {
      const result = await this.installmentModel.find({
        date: {
          $gte: startDate,
          $lt: finishDate
        }
      }).exec();
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

}