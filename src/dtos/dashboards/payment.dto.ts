import { PaymentType } from "../../enums/payment-type.enum";

export class PaymentDTO {

  date: Date;

  value: Number;

  type: PaymentType;

}