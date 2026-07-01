import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true, collection: 'messages' })
export class Message {
  @Prop({ required: true }) contractId!: string;
  @Prop({ required: true }) senderId!: string;
  @Prop({ required: true }) body!: string;
  @Prop({ enum: ['text', 'code', 'file', 'system', 'ai', 'warning'], default: 'text' }) kind!: string;
  @Prop({ default: '' }) fileUrl!: string;
  @Prop({ default: '' }) fileName!: string;
  @Prop({ default: false }) flagged!: boolean;
  @Prop({ default: '' }) flagReason!: string;
}
export const MessageSchema = SchemaFactory.createForClass(Message);
