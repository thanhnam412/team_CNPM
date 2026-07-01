import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContractDocument = Contract & Document;

@Schema({ timestamps: true, collection: 'contracts' })
export class Contract {
  @Prop({ required: true }) jobId!: string;
  @Prop({ required: true }) proposalId!: string;
  @Prop({ required: true }) clientId!: string;
  @Prop({ required: true }) expertId!: string;
  @Prop({ required: true }) title!: string;
  @Prop({ required: true }) totalBudget!: number;
  @Prop({ default: 'USD' }) currency!: string;
  @Prop({ default: 0 }) escrowAmount!: number;
  @Prop({ default: 0 }) releasedAmount!: number;
  @Prop({ enum: ['active', 'completed', 'disputed', 'cancelled', 'paused', 'review'], default: 'active' }) status!: string;
  @Prop({ enum: ['public', 'private', 'standard', 'private_delivery'], default: 'public' }) privacy!: string;
  @Prop({ default: 0 }) progress!: number;
  @Prop({ type: [String], default: [] }) milestoneIds!: string[];
  @Prop({ default: null }) completedAt!: Date;
  @Prop({ default: '' }) cancelReason!: string;
  @Prop({ default: '' }) terms!: string;
}
export const ContractSchema = SchemaFactory.createForClass(Contract);
