import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProposalDocument = Proposal & Document;

@Schema({ timestamps: true, collection: 'proposals' })
export class Proposal {
  @Prop({ required: true }) jobId!: string;
  @Prop({ required: true }) expertId!: string;
  @Prop({ required: true }) coverLetter!: string;
  @Prop({ required: true }) rate!: number;
  @Prop({ default: 'USD' }) currency!: string;
  @Prop({ required: true, default: '21 days' }) eta!: string;
  @Prop({ enum: ['pending', 'accepted', 'rejected', 'withdrawn', 'sent', 'shortlisted'], default: 'pending' }) status!: string;
  @Prop({ default: 0 }) score!: number;
  @Prop({ default: '' }) clientNote!: string;
  @Prop({ type: [String], default: [] }) attachmentUrls!: string[];
}
export const ProposalSchema = SchemaFactory.createForClass(Proposal);
