import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateJobDto {
  @IsString() title!: string;
  @IsString() clientId!: string;
  @IsOptional() @IsString() enterpriseId?: string;
  @IsString() category!: string;
  @IsNumber() budget!: number;
  @IsString() duration!: string;
  @IsString() description!: string;
  @IsArray() skills!: string[];
  @IsOptional() @IsString() status?: string;
}
