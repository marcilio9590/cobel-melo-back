import { Type } from "class-transformer";
import { Allow, IsDate } from "class-validator";
import { ObjectId } from "mongoose";

export class InstallmentsDTO {

  process: ObjectId;

  @Allow()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @Allow()
  value: Number;

}