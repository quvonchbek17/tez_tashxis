import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Doctor } from './doctors.schema';

export type DiseaseDocument = Disease & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Disease {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  icd: string;

  @Prop({
    type: [
      {
        id: { type: Types.ObjectId, ref: 'Drug', required: true },
        default: { type: Boolean, default: false },
      },
    ],
  })
  drugs: {
    id: Types.ObjectId;
    default: boolean;
  }[];

  @Prop({
    type: [
      {
        id: { type: Types.ObjectId, ref: 'Advice', required: true },
        default: { type: Boolean, default: false },
      },
    ],
  })
  advices: {
    id: Types.ObjectId;
    default: boolean;
  }[];

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctor: Types.ObjectId;
}

export const DiseaseSchema = SchemaFactory.createForClass(Disease);
