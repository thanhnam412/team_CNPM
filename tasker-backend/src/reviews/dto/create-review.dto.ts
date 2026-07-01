import { IsNumber, IsString, Max, Min } from 'class-validator';
export class CreateReviewDto { @IsString() contractId!: string; @IsString() fromUserId!: string; @IsString() toUserId!: string; @IsNumber() @Min(1) @Max(5) rating!: number; @IsString() body!: string; }
