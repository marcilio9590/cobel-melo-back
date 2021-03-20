import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { Response } from 'express';
import { Profile } from "../decorators/profiles.decorator";
import { ProcessDTO } from "../dtos/create-process.dto";
import { ProfileTypes } from "../enums/profiles.enum";
import { ProcessService } from "../services/process.service";

@Controller('/v1/process')
export class ProcessController {

  constructor(
    private processService: ProcessService
  ) { }

  @Post()
  @Profile([ProfileTypes.EDIT, ProfileTypes.ADMIN])
  async create(@Body() processDTO: ProcessDTO, @Res() res: Response): Promise<any> {
    await this.processService.create(processDTO);
    res.status(HttpStatus.CREATED).send();
  }

}