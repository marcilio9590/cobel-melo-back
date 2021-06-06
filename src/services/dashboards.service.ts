import { Injectable } from "@nestjs/common";
import * as moment from 'moment';
import { InstallmentsService } from "./installments.service";
import { ProcessService } from "./process.service";

@Injectable()
export class DashboardsService {

  constructor(
    private processService: ProcessService,
    private installmentsService: InstallmentsService
  ) { }

  async getTotalProcessesByMonth(year: string, month: string) {
    const startDate = this.getStartAndFinishDate(year, month, true);
    const finishDate = this.getStartAndFinishDate(year, month, false);

    const result = await this.processService.getCountProcessesByRangeDate(startDate, finishDate);
    return result;
  }

  async getAvailableYears() {
    const result = await this.processService.getAvailableYears();
    return result;
  }

  async getDashsData(year: string, month: string) {
    const startDate = this.getStartAndFinishDate(year, month, true);
    const finishDate = this.getStartAndFinishDate(year, month, false);

    const processes = await this.processService.getProcessesByRangeDateAndEntraceValue(startDate, finishDate);
    const installments = await this.installmentsService.getInstallmentsByRangeDate(startDate, finishDate);


    let result = {};
    result['dayValue'] = [];

    for (let i = 1; i <= finishDate.getDate(); i++) {
      let day = { x: `Dia ${i}`, y: 0 };
      installments?.forEach(installment => {
        if (moment(installment['date']).date() === i) {
          day.y += Number(installment.value);
        };
      });
      result['dayValue'].push(day);
    }

    return result;
  }

  private getStartAndFinishDate(year: string, month: string, isStart: boolean) {
    const strDate = year + '-' + month + '-' + '01';
    if (isStart) {
      return moment(strDate).clone().startOf('month').toDate();
    } else {
      return moment(strDate).clone().endOf('month').toDate();
    }
  }

}