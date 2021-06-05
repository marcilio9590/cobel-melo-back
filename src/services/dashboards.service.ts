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

    // data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]

    const processes = await this.processService.getProcessesByRangeDateAndEntraceValue(startDate, finishDate);
    const installments = await this.installmentsService.getInstallmentsByRangeDate(startDate, finishDate);


    let result = {};
    result['dayValue'] = [];

    for (let i = 1; i <= finishDate.getDate(); i++) {
      let day = [i, 0];
      installments?.forEach(installment => {
        if (moment(installment['date']).date() === i) {
          day[1] += Number(installment.value);
        };
      });
      result['dayValue'].push(day);
    }

    // for (let i = 1; i <= finishDate.getDate(); i++) {
    //   let day = [i, 0];
    //   processes?.forEach((process) => {
    //     if (process.entraceValue) {
    //       day[1] += Number(process.entraceValue);
    //     }
    //     process?.installments?.forEach(installment => {
    //       if (moment(installment['date'])?.isAfter(startDate) && moment(installment['date'])?.isBefore(finishDate)) {
    //         day[1] += Number(installment['value']);
    //       }
    //     });
    //     result['dayValue'].push(day);
    //   });
    // }

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