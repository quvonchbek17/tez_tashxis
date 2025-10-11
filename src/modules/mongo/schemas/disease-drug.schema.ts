import { Types, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DiseaseDrugDocument = DiseaseDrug & Document;

@Schema({ timestamps: { createdAt: 'created_at' } })
export class DiseaseDrug {
  @Prop({ type: Types.ObjectId, ref: 'Disease', required: true })
  disease_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Drug', required: true })
  drug_id: Types.ObjectId;

  @Prop({ default: 0 })
  priority: number;

  @Prop({ default: false })
  default_selected: boolean;

  @Prop()
  custom_dosage?: string;
}

export const DiseaseDrugSchema = SchemaFactory.createForClass(DiseaseDrug);
