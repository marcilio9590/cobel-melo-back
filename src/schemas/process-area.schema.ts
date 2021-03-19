import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from "mongoose-paginate-v2";

export type ProcessAreaDocument = ProcessArea & Document;

@Schema()
export class ProcessArea {

  @Prop()
  name: string;

}

const ProcessAreaSchema = SchemaFactory.createForClass(ProcessArea).plugin(mongoosePaginate);

ProcessAreaSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

ProcessAreaSchema.set('toJSON', {
  virtuals: true
});

export default ProcessAreaSchema;