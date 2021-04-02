export class CreateHearingDTO {

  constructor(
    public local: string,
    public date: Date,
    public customer: string,
    public process: string,
    public link: string
  ) { }

}