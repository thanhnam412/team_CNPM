import { IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateTransactionDto { @IsString() userId!: string; @IsOptional() @IsString() contractId?: string; @IsString() type!: string; @IsNumber() amount!: number; @IsOptional() @IsString() status?: string; @IsOptional() @IsString() note?: string; }
