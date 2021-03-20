import { Body, Controller, Get, HttpStatus, Param, Post, Res } from "@nestjs/common";
import { Response } from 'express';
import { Profile } from "../decorators/profiles.decorator";
import { CreateProcessDTO } from "../dtos/create-process.dto";
import { Result } from "../dtos/result.dto";
import { ProfileTypes } from "../enums/profiles.enum";
import { ProcessService } from "../services/process.service";

@Controller('/v1/process')
export class ProcessController {

  constructor(
    private processService: ProcessService
  ) { }

  @Post()
  @Profile([ProfileTypes.EDIT, ProfileTypes.ADMIN])
  async create(@Body() createProcessDTO: CreateProcessDTO, @Res() res: Response): Promise<any> {
    await this.processService.create(createProcessDTO);
    res.status(HttpStatus.CREATED).send();
  }

  @Get('/:processId')
  async getCustomer(@Res() res: Response, @Param('processId') processId: string): Promise<any> {
    const customer = await this.processService.getProcessDetail(processId);
    const result = new Result('', true, customer, null);
    res.status(HttpStatus.OK).send(result);
  }

}