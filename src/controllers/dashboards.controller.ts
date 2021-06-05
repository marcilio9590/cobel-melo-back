import { Controller, Get, HttpStatus, Query, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Response } from 'express';
import { Profile } from "../decorators/profiles.decorator";
import { ProfileTypes } from "../enums/profiles.enum";
import { GetDashboardsDTO } from "../dtos/get-dashboards.dto";
import { DashboardsService } from "../services/dashboards.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Controller('/v1/dashboards')
export class DashboardsController {

  constructor(
    private dashboardsService: DashboardsService
  ) { }

  @Get('/processes/count')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Profile([ProfileTypes.ADMIN])
  async getTotalProcessesByMonth(@Res() res: Response, @Query() queryParams: GetDashboardsDTO) {
    const result = await this.dashboardsService.getTotalProcessesByMonth(queryParams.year, queryParams.month);
    res.status(HttpStatus.OK).send({ count: result });
  }

  @Get('/processes/years')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Profile([ProfileTypes.ADMIN])
  async getAvailableYears(@Res() res: Response) {
    const result = await this.dashboardsService.getAvailableYears();
    res.status(HttpStatus.OK).send(result);
  }

  @Get('/processes')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Profile([ProfileTypes.ADMIN])
  async getDashsData(@Res() res: Response, @Query() queryParams: GetDashboardsDTO) {
    const result = await this.dashboardsService.getDashsData(queryParams.year, queryParams.month);
    res.status(HttpStatus.OK).send(result);
  }

}