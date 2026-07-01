import { IsOptional, IsString } from 'class-validator';
export class UpdateMilestoneDto { @IsOptional() @IsString() status?: string; @IsOptional() @IsString() deliverable?: string; @IsOptional() @IsString() changeRequest?: string; }
