import { Allow } from "class-validator";

export class InstallmentsDTO {

  process: String;

  @Allow()
  date: string;

  @Allow()
  value: Number;

}