import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import * as mongoosePaginate from "mongoose-paginate-v2";

export type ProcessDocument = Process & Document;

@Schema()
export class Process {

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customer: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ProcessArea' })
  processArea: Types.ObjectId;

  @Prop()
  description: string;

  @Prop()
  number: string;

  @Prop()
  vara: string;

  @Prop()
  comarca: string;

  @Prop()
  valueOfCase: Number;

  @Prop()
  comments: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Movement' })
  movements: [Types.ObjectId];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Hearing' })
  hearings: [Types.ObjectId];

  @Prop({ default: Date.now() })
  createdAt: Date;

}

const ProcessSchema = SchemaFactory.createForClass(Process).plugin(mongoosePaginate);

ProcessSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

ProcessSchema.set('toJSON', {
  virtuals: true
});

export default ProcessSchema;