import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res, UseGuards } from "@nestjs/common";
import { Response } from 'express';
import { Profile } from "../decorators/profiles.decorator";
import { CreateHearingDTO } from "../dtos/create-hearing.dto";
import { Result } from "../dtos/result.dto";
import { ProfileTypes } from "../enums/profiles.enum";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { HearingService } from "../services/hearings.service";

@Controller('/v1/hearings')
export class HearingController {

  constructor(
    private hearingService: HearingService
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Profile([ProfileTypes.EDIT, ProfileTypes.ADMIN])
  async create(@Body() createProcessAreaDTO: CreateHearingDTO, @Res() res: Response): Promise<any> {
    await this.hearingService.create(createProcessAreaDTO);
    res.status(HttpStatus.CREATED).send();
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  @Profile([ProfileTypes.EDIT, ProfileTypes.ADMIN])
  async update(@Body() hearingDTO: CreateHearingDTO, @Param('id') id: string, @Res() res: Response): Promise<any> {
    await this.hearingService.update(id, hearingDTO);
    res.status(HttpStatus.OK).send();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async paginate(@Res() res: Response, @Query() query): Promise<any> {
    const sort = query['sort'] ? JSON.parse(query['sort']) : null;
    const processAreas = await this.hearingService.paginate(query['page'], query['size'], sort, query['removePast']);
    const result = new Result('', true, processAreas, null);
    res.status(HttpStatus.PARTIAL_CONTENT).send(result);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @Profile([ProfileTypes.ADMIN, ProfileTypes.EDIT])
  async deleteCustomer(@Res() res: Response, @Param('id') id: string): Promise<any> {
    await this.hearingService.delete(id);
    res.status(HttpStatus.NO_CONTENT).send();
  }

}