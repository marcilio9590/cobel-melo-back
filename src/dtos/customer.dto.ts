
export class CustomerDTO {
  constructor(
    public name: string,
    public email: string,
    public cpf: string,
    public phones: string[],
    public address: string
  ) { }
}