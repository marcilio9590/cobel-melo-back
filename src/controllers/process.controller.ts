import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res } from "@nestjs/common";
import { Response } from 'express';
import { Profile } from "../decorators/profiles.decorator";
import { ProcessDTO } from "../dtos/create-process.dto";
import { Result } from "../dtos/result.dto";
import { ProfileTypes } from "../enums/profiles.enum";
import { ProcessService } from "../services/process.service";

@Controller('/v1/process')
export class ProcessController {

  constructor(
    private processService: ProcessService
  ) { }

  @Get()
  async paginate(@Res() res: Response, @Query('page') page: Number, @Query('size') size: Number): Promise<any> {
    const customers = await this.processService.paginate(page, size);
    const result = new Result('', true, customers, null);
    res.status(HttpStatus.PARTIAL_CONTENT).send(result);
  }

  @Patch('/:id')
  @Profile([ProfileTypes.EDIT, ProfileTypes.ADMIN])
  async update(@Param('id') id: string, @Body() processDTO: ProcessDTO, @Res() res: Response): Promise<any> {
    await this.processService.update(id, processDTO);
    res.status(HttpStatus.CREATED).send();
  }

  @Post()
  @Profile([ProfileTypes.EDIT, ProfileTypes.ADMIN])
  async create(@Body() createProcessDTO: ProcessDTO, @Res() res: Response): Promise<any> {
    await this.processService.create(createProcessDTO);
    res.status(HttpStatus.CREATED).send();
  }

  @Get('/:id')
  async getProcessDetail(@Res() res: Response, @Param('id') id: string): Promise<any> {
    const customer = await this.processService.getProcessDetail(id);
    const result = new Result('', true, customer, null);
    res.status(HttpStatus.OK).send(result);
  }

  @Delete('/:id')
  @Profile([ProfileTypes.ADMIN, ProfileTypes.EDIT])
  async delete(@Res() res: Response, @Param('id') id: string): Promise<any> {
    await this.processService.delete(id);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Delete('/:id/movements/:movementId')
  @Profile([ProfileTypes.ADMIN, ProfileTypes.EDIT])
  async deleteMovement(@Res() res: Response, @Param('id') id: string, @Param('movementId') movementId: string): Promise<any> {
    await this.processService.deleteMovement(id, movementId);
    res.status(HttpStatus.NO_CONTENT).send();
  }

}