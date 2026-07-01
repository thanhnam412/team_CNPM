import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JobDocument = Job & Document;

@Schema({ timestamps: true, collection: 'jobs' })
export class Job {
  @Prop({ required: true, trim: true }) title!: string;
  @Prop({ required: true }) description!: string;
  @Prop({ required: true }) clientId!: string;
  @Prop({ default: '' }) enterpriseId!: string;
  @Prop({ required: true }) category!: string;
  @Prop({ type: [String], default: [] }) skills!: string[];
  @Prop({ required: true }) budget!: number;
  @Prop({ default: 'USD' }) currency!: string;
  @Prop({ required: true }) duration!: string;
  @Prop({ enum: ['Starter', 'Pro', 'Enterprise'], default: 'Pro' }) level!: string;
  @Prop({ enum: ['open', 'closed', 'in_progress', 'pending_approval', 'draft', 'matching', 'active', 'completed', 'rejected', 'disputed'], default: 'open' }) status!: string;
  @Prop({ default: '' }) aiBrief!: string;
  @Prop({ type: [String], default: [] }) proposalIds!: string[];
  @Prop({ default: 0 }) viewCount!: number;
  @Prop({ default: null }) closedAt!: Date;
  @Prop({ default: false }) isRemote!: boolean;
  @Prop({ default: '' }) location!: string;
  @Prop({ type: [String], default: [] }) attachmentUrls!: string[];
  @Prop({ default: '' }) approvedBy!: string;
  @Prop({ default: '' }) approvalNote!: string;
}
export const JobSchema = SchemaFactory.createForClass(Job);
