import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from "mongoose-paginate-v2";

export type CustomerDocument = Customer & Document;

@Schema()
export class Customer {

  @Prop()
  name: string;

  @Prop({ unique: true, sparse: true })
  email: string;

  @Prop()
  cpf: string;

  @Prop()
  phones: string[];

  @Prop()
  address: string;

  @Prop({ default: Date.now() })
  createdAt: Date;

}

const CustomerSchema = SchemaFactory.createForClass(Customer).plugin(mongoosePaginate);

CustomerSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

CustomerSchema.set('toJSON', {
  virtuals: true
});

export default CustomerSchema;