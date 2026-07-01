import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true, collection: 'reviews' })
export class Review {
  @Prop({ required: true }) contractId!: string;
  @Prop({ required: true }) fromUserId!: string;
  @Prop({ required: true }) toUserId!: string;
  @Prop({ required: true, min: 1, max: 5 }) rating!: number;
  @Prop({ required: true }) body!: string;
  @Prop({ default: '' }) reply!: string;
  @Prop({ default: '' }) aiReply!: string;
  @Prop({ default: 0 }) communicationRating!: number;
  @Prop({ default: 0 }) qualityRating!: number;
  @Prop({ default: 0 }) timelinessRating!: number;
}
export const ReviewSchema = SchemaFactory.createForClass(Review);
