import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res, UseGuards } from "@nestjs/common";
import { Response } from 'express';
import { Profile } from "../decorators/profiles.decorator";
import { CustomerDTO } from "../dtos/customer.dto";
import { Result } from "../dtos/result.dto";
import { ProfileTypes } from "../enums/profiles.enum";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CustomersService } from "../services/customers.service";

@Controller('/v1/customers')
export class CustomersController {

  constructor(
    private customersService: CustomersService,
  ) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCustomers(@Res() res: Response, @Query('page') page: Number, @Query('size') size: Number): Promise<any> {
    const customers = await this.customersService.getCustomers(page, size);
    const result = new Result('', true, customers, null);
    res.status(HttpStatus.PARTIAL_CONTENT).send(result);
  }

  @Get('/:customerId/process')
  @UseGuards(JwtAuthGuard)
  async getCustomerProcess(@Res() res: Response, @Param('customerId') customerId: string): Promise<any> {
    const process = await this.customersService.getCustomerProcess(customerId);
    const result = new Result('', true, process, null);
    res.status(HttpStatus.OK).send(result);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Profile([ProfileTypes.EDIT, ProfileTypes.ADMIN])
  async create(@Body() customerDTO: CustomerDTO, @Res() res: Response): Promise<any> {
    await this.customersService.create(customerDTO);
    res.status(HttpStatus.CREATED).send();
  }

  @Put('/:customerId')
  @UseGuards(JwtAuthGuard)
  @Profile([ProfileTypes.EDIT, ProfileTypes.ADMIN])
  async update(@Param('customerId') customerId: string, @Body() customerDTO: CustomerDTO, @Res() res: Response): Promise<any> {
    await this.customersService.update(customerId, customerDTO);
    res.status(HttpStatus.OK).send();
  }


  @Delete('/:customerId')
  @UseGuards(JwtAuthGuard)
  @Profile([ProfileTypes.ADMIN, ProfileTypes.EDIT])
  async deleteCustomer(@Res() res: Response, @Param('customerId') customerId: string): Promise<any> {
    await this.customersService.deleteCustomer(customerId);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Get('/:name')
  @UseGuards(JwtAuthGuard)
  async getCustomersByName(@Res() res: Response, @Param('name') name: string): Promise<any> {
    const customers = await this.customersService.getCustomersByName(name);
    const result = new Result('', true, customers, null);
    res.status(HttpStatus.OK).send(result);
  }

}