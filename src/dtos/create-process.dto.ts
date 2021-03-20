
export class ProcessDTO {

  constructor(
    public customer: string,
    public processArea: string,
    public description: string,
    public number: string,
    public vara: string,
    public comarca: string,
    public valueOfCase: Number,
    public comments: string,
    public movements: string[],
    public hearings: string[],
    public createdAt: Date
  ) { }



}