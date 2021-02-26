export class EmailDTO {

  constructor(
    public to: string,
    public templateId: string,
    public variables: any
  ) { }

}