import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type DrugDocument = Drug & Document;

@Schema({ timestamps: { createdAt: 'created_at' } })
export class Drug {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Doctor', required: true })
  doctor_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  form?: string; // tablet, syrup, injection

  @Prop()
  dosage?: string; // 500mg, 5ml, etc.

  @Prop()
  instructions?: string;

  @Prop({ default: true })
  is_active: boolean;
}

export const DrugSchema = SchemaFactory.createForClass(Drug);
DrugSchema.index({ doctor_id: 1, name: 1 }, { unique: true });
