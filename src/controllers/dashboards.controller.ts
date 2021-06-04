import { Controller, Get, HttpStatus, Query, Res, UsePipes, ValidationPipe } from "@nestjs/common";
import { Response } from 'express';
import { GetDashboardsDTO } from "../dtos/get-dashboards.dto";
import { DashboardsService } from "../services/dashboards.service";

@Controller('/v1/dashboards')
export class DashboardsController {

  constructor(
    private dashboardsService: DashboardsService
  ) { }

  @Get('/processes/count')
  @UsePipes(new ValidationPipe())
  async getTotalProcessesByMonth(@Res() res: Response, @Query() queryParams: GetDashboardsDTO) {
    const result = await this.dashboardsService.getTotalProcessesByMonth(queryParams.year, queryParams.month);
    res.status(HttpStatus.OK).send({ count: result });
  }

  @Get('/processes/years')
  @UsePipes(new ValidationPipe())
  async getAvailableYears(@Res() res: Response) {
    const result = await this.dashboardsService.getAvailableYears();
    res.status(HttpStatus.OK).send(result);
  }

}