import { PaymentDTO } from "./payment.dto";

export class DashboardCustomersPaymentsDTO {

  name: string;

  customerId: string;

  payments: PaymentDTO[];

}