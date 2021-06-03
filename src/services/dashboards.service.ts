import { Injectable } from "@nestjs/common";
import { ProcessService } from "./process.service";
import * as moment from 'moment';

@Injectable()
export class DashboardsService {

  constructor(
    private processService: ProcessService
  ) { }

  async getTotalProcessesByMonth(year: string, month: string) {
    const strDate = year + '-' + month + '-' + '01';
    const startDate = moment(strDate).clone().startOf('month').toDate();
    const finishDate = moment(strDate).clone().endOf('month').toDate();

    const result = await this.processService.getCountProcessesByRangeDate(startDate, finishDate);
    return result;
  }

}