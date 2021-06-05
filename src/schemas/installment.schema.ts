import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import * as mongoosePaginate from "mongoose-paginate-v2";

export type InstallmentDocument = Installment & Document;

@Schema()
export class Installment {

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Process' })
  process: Types.ObjectId;

  @Prop()
  date: Date;

  @Prop()
  value: Number;

}

const InstallmentSchema = SchemaFactory.createForClass(Installment).plugin(mongoosePaginate);

InstallmentSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

InstallmentSchema.set('toJSON', {
  virtuals: true
});

export default InstallmentSchema;