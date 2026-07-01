import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DisputeDocument = Dispute & Document;

@Schema({ timestamps: true, collection: 'disputes' })
export class Dispute {
  @Prop({ required: true }) contractId!: string;
  @Prop({ required: true }) openedBy!: string;
  @Prop({ required: true }) reason!: string;
  @Prop({ default: '' }) description!: string;
  @Prop({ type: [String], default: [] }) evidenceUrls!: string[];
  @Prop({ type: [String], default: [] }) evidence!: string[];
  @Prop({ enum: ['open', 'under_review', 'mediation', 'resolved', 'closed', 'collecting_evidence', 'decision', 'enforced'], default: 'open' }) status!: string;
  @Prop({ default: '' }) decision!: string;
  @Prop({ default: '' }) adminNote!: string;
  @Prop({ enum: ['refund_client', 'release_expert', 'split', 'pending', '', 'release_to_expert', 'request_evidence'], default: '' }) resolution!: string;
  @Prop({ default: null }) resolvedAt!: Date;
  @Prop({ default: '' }) resolvedBy!: string;
}
export const DisputeSchema = SchemaFactory.createForClass(Dispute);
