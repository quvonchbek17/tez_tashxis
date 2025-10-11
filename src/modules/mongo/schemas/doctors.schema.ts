import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type DoctorDocument = Doctor & Document;

@Schema({ timestamps: { createdAt: 'created_at' } })
export class Doctor {
  @Prop({ required: true, unique: true })
  phone: string; // +998XXXXXXXXX

  @Prop({ required: true, unique: true })
  login: string;

  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  specialization?: string;

  @Prop()
  license_number?: string;

  @Prop({ default: true })
  is_active: boolean;

  @Prop()
  last_login_at?: Date;

  @Prop({ required: false })
  role: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
