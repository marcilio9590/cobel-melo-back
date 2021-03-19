import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from "mongoose-paginate-v2";

export type MovementDocument = Movement & Document;

@Schema()
export class Movement {

  @Prop()
  description: string;

}

const MovementSchema = SchemaFactory.createForClass(Movement).plugin(mongoosePaginate);

MovementSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

MovementSchema.set('toJSON', {
  virtuals: true
});

export default MovementSchema;