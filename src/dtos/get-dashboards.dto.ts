import { IsString, MaxLength } from "class-validator";

export class GetDashboardsDTO {

  @IsString()
  @MaxLength(4)
  year: string;

  @IsString()
  @MaxLength(2)
  month: string;

}