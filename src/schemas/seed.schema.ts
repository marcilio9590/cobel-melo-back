import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type SeedDocument = Seed & Document;

@Schema()
export class Seed {
  @Prop()
  secret: string;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

}

export const SeedSchema = SchemaFactory.createForClass(Seed);