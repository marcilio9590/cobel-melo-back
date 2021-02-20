import { UserStatus } from "src/enums/user-status.enum";

export class CreateUserDTO {
  constructor(
    public username: string,
    public cpf: string,
    public profileType: string,
    public status: UserStatus
  ) { }
}