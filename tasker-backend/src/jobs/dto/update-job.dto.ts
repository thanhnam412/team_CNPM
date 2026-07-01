import { IsOptional, IsString } from 'class-validator';
export class UpdateJobDto { @IsOptional() @IsString() status?: string; @IsOptional() @IsString() approvalNote?: string; }
