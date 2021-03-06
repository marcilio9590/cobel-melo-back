import { UserStatus } from "../enums/user-status.enum";

export class UserDTO {
  constructor(
    public username: string,
    public cpf: string,
    public profileType: string,
    public status: UserStatus
  ) { }
}