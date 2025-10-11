import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type DiseaseAdviceDocument = DiseaseAdvice & Document;

@Schema({ timestamps: { createdAt: 'created_at' } })
export class DiseaseAdvice {
  @Prop({ type: Types.ObjectId, ref: 'Disease', required: true })
  disease_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Advice', required: true })
  advice_id: Types.ObjectId;

  @Prop({ default: 0 })
  priority: number;

  @Prop({ default: false })
  default_selected: boolean;
}

export const DiseaseAdviceSchema = SchemaFactory.createForClass(DiseaseAdvice);
