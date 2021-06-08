import { Injectable } from "@nestjs/common";
import * as moment from 'moment';
import { DashboardCustomersPaymentsDTO } from "../dtos/dashboards/customers-payments.dto";
import { PaymentDTO } from "../dtos/dashboards/payment.dto";
import { PaymentType } from "../enums/payment-type.enum";
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

  async getDayValuesData(year: string, month: string) {
    const startDate = this.getStartAndFinishDate(year, month, true);
    const finishDate = this.getStartAndFinishDate(year, month, false);

    const processes = await this.processService.getProcessesByRangeDateAndEntraceValue(startDate, finishDate, 'installments');
    const installments = await this.installmentsService.getInstallmentsByRangeDate(startDate, finishDate);

    let result = [];

    if (processes?.length === 0 && installments?.length === 0) {
      return result;
    }

    for (let i = 1; i <= finishDate.getDate(); i++) {
      let day = { x: `Dia ${i}`, y: 0 };
      installments?.forEach(installment => {
        if (moment(installment['date']).date() === i) {
          day.y += Number(installment.value);
        };
      });
      result.push(day);
    }

    processes.forEach(p => {
      const idx = result.findIndex(r => r.x.includes(moment(p.contractDate).date()));
      if (idx >= 0) {
        result[idx].y += p.entraceValue;
      }
    });
    return result;
  }

  async getCustomersPaymentsData(year: string, month: string) {
    let result: DashboardCustomersPaymentsDTO[] = [];

    const startDate = this.getStartAndFinishDate(year, month, true);
    const finishDate = this.getStartAndFinishDate(year, month, false);

    try {
      const installments = await this.installmentsService.getInstallmentsByRangeDate(startDate, finishDate);
      const processes = await this.processService.getProcessesByRangeDateAndEntraceValue(startDate, finishDate, 'installments customer');
      if (processes?.length === 0 && installments?.length === 0) {
        return result;
      }
      processes.forEach(p => {
        let obj = new DashboardCustomersPaymentsDTO();
        obj.customerId = p.customer['id'];
        obj.name = p.customer['name'];
        obj.payments = [];

        if (p.entraceValue > 0) {
          let payment = new PaymentDTO();
          payment.date = p.contractDate;
          payment.type = PaymentType.ENTRACE;
          payment.value = p.entraceValue;
          obj.payments.push(payment);
        }

        const customerIdx = result.findIndex(r => r.customerId === p.customer['id']);
        if (customerIdx > -1) {
          if (obj.payments.length > 0) {
            result[customerIdx].payments.push(obj.payments[0]);
          }
        } else {
          result.push(obj);
        }
      });
    } catch (error) {
      console.error(error);
      throw error;
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