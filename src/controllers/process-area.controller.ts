import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res } from "@nestjs/common";
import { Response } from 'express';
import { Profile } from "../decorators/profiles.decorator";
import { CreateProcessAreaDTO } from "../dtos/create-process-area.dto";
import { Result } from "../dtos/result.dto";
import { UpdateProcessAreaDTO } from "../dtos/update-process-area.dto";
import { ProfileTypes } from "../enums/profiles.enum";
import { ProcessAreaService } from "../services/process-area.service";

@Controller('/v1/process-area')
export class ProcessAreaController {

  constructor(
    private processAreaService: ProcessAreaService
  ) { }

  @Post()
  @Profile([ProfileTypes.EDIT, ProfileTypes.ADMIN])
  async create(@Body() createProcessAreaDTO: CreateProcessAreaDTO, @Res() res: Response): Promise<any> {
    await this.processAreaService.create(createProcessAreaDTO);
    res.status(HttpStatus.CREATED).send();
  }

  @Put()
  @Profile([ProfileTypes.EDIT, ProfileTypes.ADMIN])
  async update(@Body() updateProcessAreaDTO: UpdateProcessAreaDTO, @Res() res: Response): Promise<any> {
    await this.processAreaService.update(updateProcessAreaDTO);
    res.status(HttpStatus.OK).send();
  }

  @Get()
  async paginate(@Res() res: Response, @Query('page') page: Number, @Query('size') size: Number): Promise<any> {
    const processAreas = await this.processAreaService.paginate(page, size);
    const result = new Result('', true, processAreas, null);
    res.status(HttpStatus.PARTIAL_CONTENT).send(result);
  }

  @Get('/all')
  async getAllProcessAreas(@Res() res: Response): Promise<any> {
    const processAreas = await this.processAreaService.getAllProcessAreas();
    const result = new Result('', true, processAreas, null);
    res.status(HttpStatus.OK).send(result);
  }

  @Delete('/:id')
  @Profile([ProfileTypes.ADMIN, ProfileTypes.EDIT])
  async deleteCustomer(@Res() res: Response, @Param('id') id: string): Promise<any> {
    await this.processAreaService.delete(id);
    res.status(HttpStatus.NO_CONTENT).send();
  }

}