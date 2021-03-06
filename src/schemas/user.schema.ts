import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from "mongoose-paginate-v2";

export type UserDocument = User & Document;

@Schema()
export class User {

  @Prop({ unique: true, sparse: true })
  username: string;

  @Prop()
  password: string;

  @Prop()
  name: string;

  @Prop()
  cpf: string;

  @Prop()
  profileType: string;

  @Prop()
  status: string;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop()
  lastLogin: Date;

}

const UserSchema = SchemaFactory.createForClass(User).plugin(mongoosePaginate);

UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true
});

export default UserSchema;