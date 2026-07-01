import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true, collection: 'notifications' })
export class Notification {
  @Prop({ required: true }) userId!: string;
  @Prop({ required: true }) title!: string;
  @Prop({ required: true }) body!: string;
  @Prop({ enum: ['info', 'success', 'warning', 'error', 'danger'], default: 'info' }) tone!: string;
  @Prop({ default: false }) read!: boolean;
  @Prop({ default: '' }) link!: string;
  @Prop({ default: '' }) entityType!: string;
  @Prop({ default: '' }) entityId!: string;
}
export const NotificationSchema = SchemaFactory.createForClass(Notification);
