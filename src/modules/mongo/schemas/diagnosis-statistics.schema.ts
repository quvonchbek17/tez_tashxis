import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type DiagnosisStatisticDocument = DiagnosisStatistic & Document;

@Schema({ timestamps: { createdAt: 'created_at' } })
export class DiagnosisStatistic {
  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctor_id: Types.ObjectId;

  @Prop()
  patient_age?: number;

  @Prop({ enum: ['male', 'female'] })
  patient_gender?: string;

  @Prop({ type: [Types.ObjectId], ref: 'Disease', required: true })
  disease_ids: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Drug', required: true })
  drug_ids: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Advice', required: true })
  advice_ids: Types.ObjectId[];

  @Prop({ required: true })
  diagnosis_date: Date;

  @Prop()
  session_duration?: number; // seconds
}

export const DiagnosisStatisticSchema = SchemaFactory.createForClass(DiagnosisStatistic);
