export class ResultError {
  constructor(
    public message: string,
    public errors: any,
    public code: string
  ) {
  }
}