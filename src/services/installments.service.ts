import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InstallmentDocument } from "src/schemas/installment.schema";
import { InstallmentsDTO } from "../dtos/installments.dto";

@Injectable()
export class InstallmentsService {

  constructor(
    @Inject('INSTALLMENT_MODEL') private readonly installmentModel: Model<InstallmentDocument>
  ) { }

  async createInstallments(processId: string, installments: InstallmentsDTO[]) {
    installments.forEach((i) => {
      i.process = processId;
    });
    const saved = await this.installmentModel.collection.insertMany(installments);
    return saved;
  }

  async removeInstallmentsByProcess(processId) {
    await this.installmentModel.remove({ "process": processId }, function (err) {
      if (!err) {
        return;
      }
      else {
        console.error("Ocorreu um erro ao processar sua requisição", err);
        throw err;
      }
    });
  }



}