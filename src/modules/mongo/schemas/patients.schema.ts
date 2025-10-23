import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Doctor } from './doctors.schema';
import { Diagnosis } from './diagnosis.schema';

export type PatientDocument = Patient & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Patient {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  birthOn: number;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctor: Doctor | Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Diagnosis' }], default: [] })
  diagnoses: Diagnosis[] | Types.ObjectId[];
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
