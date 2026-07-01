import { IsArray, IsString } from 'class-validator';
export class CreateDisputeDto { @IsString() contractId!: string; @IsString() openedBy!: string; @IsString() reason!: string; @IsArray() evidence!: string[]; }
