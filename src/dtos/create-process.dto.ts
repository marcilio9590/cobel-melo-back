import { Type } from "class-transformer";
import { Allow, ValidateNested } from "class-validator";
import { InstallmentsDTO } from "./installments.dto";

export class ProcessDTO {

  @Allow()
  customer: string;

  @Allow()
  processArea: string;

  @Allow()
  description: string;

  @Allow()
  number: string;

  @Allow()
  vara: string;

  @Allow()
  comarca: string;

  @Allow()
  valueOfCase: Number;

  @Allow()
  comments: string;

  @Allow()
  movements: string[];

  @Allow()
  hearings: string[];

  @Allow()
  createdAt: Date;

  @Allow()
  closed: boolean;

  @Allow()
  entraceValue: Number;

  @Allow()
  numberOfInstallments: Number;

  @ValidateNested()
  @Type(() => InstallmentsDTO)
  installments: InstallmentsDTO[];

}