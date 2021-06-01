import { Allow } from "class-validator";

export class InstallmentsDTO {

  process: String;

  @Allow()
  date: Date;

  @Allow()
  value: Number;

}