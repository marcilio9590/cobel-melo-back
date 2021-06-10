import { Controller, Get, HttpStatus, Query, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Response } from 'express';
import { Profile } from "../decorators/profiles.decorator";
import { GetDashboardsDTO } from "../dtos/get-dashboards.dto";
import { ProfileTypes } from "../enums/profiles.enum";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { DashboardsService } from "../services/dashboards.service";

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

  @Get('/processes/day-values')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Profile([ProfileTypes.ADMIN])
  async getDayValuesData(@Res() res: Response, @Query() queryParams: GetDashboardsDTO) {
    const result = await this.dashboardsService.getDayValuesData(queryParams.year, queryParams.month);
    res.status(HttpStatus.OK).send(result);
  }

  @Get('/customers/payments')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Profile([ProfileTypes.ADMIN])
  async getCustomersPaymentsData(@Res() res: Response, @Query() queryParams: GetDashboardsDTO) {
    const result = await this.dashboardsService.getCustomersPaymentsData(queryParams.year, queryParams.month);
    res.status(HttpStatus.OK).send(result);
  }

}