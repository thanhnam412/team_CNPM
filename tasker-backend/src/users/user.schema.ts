import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, unique: true, trim: true }) email!: string;
  @Prop({ required: true }) passwordHash!: string;
  @Prop({ required: true, trim: true }) fullName!: string;
  @Prop({ enum: ['client', 'expert', 'enterprise', 'admin'], required: true }) role!: string;
  @Prop({ default: '' }) avatarUrl!: string;
  @Prop({ default: '' }) title!: string;
  @Prop({ default: '' }) bio!: string;
  @Prop({ default: '' }) location!: string;
  @Prop({ type: [String], default: [] }) skills!: string[];
  @Prop({ default: 0 }) hourlyRate!: number;
  @Prop({ default: false }) isVerified!: boolean;
  @Prop({ default: false }) isBlocked!: boolean;
  @Prop({ default: 80 }) trustScore!: number;
  @Prop({ default: 0 }) reputationScore!: number;
  @Prop({ default: 0 }) totalEarnings!: number;
  @Prop({ default: 0 }) walletBalance!: number;
  @Prop({ default: '' }) company!: string;
  @Prop({ default: '' }) enterpriseId!: string;
  @Prop({ type: [String], default: [] }) portfolioUrls!: string[];
  @Prop({ default: '' }) linkedinUrl!: string;
  @Prop({ default: '' }) githubUrl!: string;
  @Prop({ default: 'vi' }) language!: string;
  @Prop({ default: false }) emailVerified!: boolean;
  @Prop({ default: null }) lastLoginAt!: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
