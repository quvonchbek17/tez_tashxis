import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Doctor } from './doctors.schema';

export type AdviceDocument = Advice & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Advice {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  minAge: number;

  @Prop()
  maxAge?: number;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctor: Types.ObjectId;
}

export const AdviceSchema = SchemaFactory.createForClass(Advice);
