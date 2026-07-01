import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true, collection: 'transactions' })
export class Transaction {
  @Prop({ required: true }) userId!: string;
  @Prop({ default: '' }) contractId!: string;
  @Prop({ default: '' }) milestoneId!: string;
  @Prop({ enum: ['deposit', 'milestone_release', 'withdrawal', 'refund', 'platform_fee', 'dispute_resolution', 'escrow', 'release', 'withdraw', 'fee'], required: true }) type!: string;
  @Prop({ required: true }) amount!: number;
  @Prop({ default: 'USD' }) currency!: string;
  @Prop({ enum: ['pending', 'completed', 'failed', 'cancelled', 'success'], default: 'completed' }) status!: string;
  @Prop({ default: '' }) note!: string;
  @Prop({ default: '' }) reference!: string;
}
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
