import { IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateMilestoneDto { @IsString() contractId!: string; @IsString() title!: string; @IsNumber() amount!: number; @IsString() dueDate!: string; @IsOptional() @IsString() status?: string; }
