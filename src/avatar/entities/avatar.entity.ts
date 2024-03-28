import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AvatarDocument = HydratedDocument<Avatar>;

@Schema()
export class Avatar {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  hash: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
