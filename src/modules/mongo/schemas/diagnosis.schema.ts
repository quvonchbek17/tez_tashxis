import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Doctor } from './doctors.schema';
import { Patient } from './patients.schema';

export type DiagnosisDocument = Diagnosis & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Diagnosis {
  @Prop({ required: true })
  date: string; // Masalan: "02.12.2024"

  @Prop({ required: true })
  file: string; // PDF fayl linki

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctor: Doctor | Types.ObjectId; // Qaysi doctor tashxis qo‘ydi

  @Prop({ type: Types.ObjectId, ref: 'Patient' })
  patient?: Patient | Types.ObjectId; // Bemor hali mavjud bo‘lmasa, bu null bo‘lishi mumkin
}

export const DiagnosisSchema = SchemaFactory.createForClass(Diagnosis);
