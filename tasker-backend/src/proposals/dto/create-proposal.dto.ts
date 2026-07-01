import { IsNumber, IsString } from 'class-validator';
export class CreateProposalDto { @IsString() jobId!: string; @IsString() expertId!: string; @IsNumber() rate!: number; @IsString() coverLetter!: string; }
