import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from "mongoose-paginate-v2";

export type HearingDocument = Hearing & Document;

@Schema()
export class Hearing {

  @Prop()
  local: string;

  @Prop()
  date: Date;

  // customer

  // process


}

const HearingSchema = SchemaFactory.createForClass(Hearing).plugin(mongoosePaginate);

HearingSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

HearingSchema.set('toJSON', {
  virtuals: true
});

export default HearingSchema;