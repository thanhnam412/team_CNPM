import { IsOptional, IsString } from 'class-validator';
export class UpdateDisputeDto { @IsOptional() @IsString() status?: string; @IsOptional() @IsString() decision?: string; @IsOptional() @IsString() adminNote?: string; @IsOptional() @IsString() resolution?: string; }
