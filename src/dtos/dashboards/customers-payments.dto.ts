import { PaymentDTO } from "./payment.dto";

export class DashboardCustomersPaymentsDTO {

  name: string;

  customerId: string;

  totalPayments: number = 0;

  payments: PaymentDTO[];

}