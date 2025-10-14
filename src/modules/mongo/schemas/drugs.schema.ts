import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Doctor } from './doctors.schema';

export type DrugDocument = Drug & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Drug {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dose: string;

  @Prop({ required: true })
  minAge: number;

  @Prop()
  maxAge?: number;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctor: Types.ObjectId;
}

export const DrugSchema = SchemaFactory.createForClass(Drug);
