import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Admin {
  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true, unique: true })
  login: string;

  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: true })
  is_active: boolean;

  @Prop()
  last_login_at?: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
