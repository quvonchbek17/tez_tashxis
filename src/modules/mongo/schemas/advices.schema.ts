import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AdviceDocument = Advice & Document;

@Schema({ timestamps: { createdAt: 'created_at' } })
export class Advice {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Doctor', required: true })
  doctor_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  category?: string; // lifestyle, diet, exercise

  @Prop({ default: true })
  is_active: boolean;
}

export const AdviceSchema = SchemaFactory.createForClass(Advice);
AdviceSchema.index({ doctor_id: 1, title: 1 }, { unique: true });
