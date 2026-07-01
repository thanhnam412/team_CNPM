import { IsOptional, IsString } from 'class-validator';
export class SendMessageDto { @IsString() contractId!: string; @IsString() senderId!: string; @IsString() body!: string; @IsOptional() @IsString() kind?: string; }
