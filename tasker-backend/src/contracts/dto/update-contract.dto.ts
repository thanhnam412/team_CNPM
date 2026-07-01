import { IsOptional, IsString } from 'class-validator';
export class UpdateContractDto { @IsOptional() @IsString() status?: string; @IsOptional() @IsString() privacy?: string; }
