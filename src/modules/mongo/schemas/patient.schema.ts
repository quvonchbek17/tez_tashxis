import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PatientDocument = Patient & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Patient {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Doctor', required: true })
  doctor_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  fullName: string; // Bemorning to'liq ismi

  @Prop({ required: true })
  phone: string; // Telefon raqami (+998...)

  @Prop({ required: true })
  birthYear: number; // Tug'ilgan yili (masalan: 1990)

  @Prop({ enum: ['male', 'female'], required: true })
  gender: string; // Jinsi

  @Prop()
  address?: string; // Manzil (ixtiyoriy)
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
PatientSchema.index({ doctor_id: 1, phone: 1 }, { unique: true });
