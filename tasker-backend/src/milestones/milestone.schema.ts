import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MilestoneDocument = Milestone & Document;

@Schema({ timestamps: true, collection: 'milestones' })
export class Milestone {
  @Prop({ required: true }) contractId!: string;
  @Prop({ required: true }) title!: string;
  @Prop({ default: '' }) description!: string;
  @Prop({ required: true }) amount!: number;
  @Prop({ required: true }) dueDate!: string;
  @Prop({ enum: ['pending', 'in_progress', 'submitted', 'approved', 'rejected', 'revision_requested', 'planned', 'change_requested', 'paid'], default: 'pending' }) status!: string;
  @Prop({ default: '' }) deliverable!: string;
  @Prop({ type: [String], default: [] }) deliverableUrls!: string[];
  @Prop({ default: '' }) changeRequest!: string;
  @Prop({ default: '' }) rejectionReason!: string;
  @Prop({ default: false }) isPrivate!: boolean;
  @Prop({ default: null }) submittedAt!: Date;
  @Prop({ default: null }) approvedAt!: Date;
  @Prop({ default: null }) paidAt!: Date;
  @Prop({ default: 0 }) order!: number;
}
export const MilestoneSchema = SchemaFactory.createForClass(Milestone);
