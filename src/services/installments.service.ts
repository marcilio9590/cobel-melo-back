import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InstallmentDocument } from "src/schemas/installment.schema";
import { InstallmentsDTO } from "../dtos/installments.dto";
import { ProcessDocument } from "../schemas/process.schema";

@Injectable()
export class InstallmentsService {

  constructor(
    @Inject('INSTALLMENT_MODEL') private readonly installmentModel: Model<InstallmentDocument>
  ) { }

  async createInstallments(createdProcess: ProcessDocument, installments: InstallmentsDTO[]) {
    installments.forEach((i) => {
      i.process = createdProcess.id;
    });
    const saved = await this.installmentModel.collection.insertMany(installments);
    return saved;
  }

}