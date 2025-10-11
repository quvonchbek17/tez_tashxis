import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type DiseaseDocument = Disease & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Disease {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Doctor', required: true })
  doctor_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  icd_code?: string;

  @Prop()
  notes?: string;

  @Prop({ default: true })
  is_active: boolean;
}

export const DiseaseSchema = SchemaFactory.createForClass(Disease);
DiseaseSchema.index({ doctor_id: 1, name: 1 }, { unique: true });
