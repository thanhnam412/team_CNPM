import { IsString, IsOptional, IsNumber, Min, IsEnum } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  budgetMax?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsString()
  @IsOptional()
  technicalScope?: string;

  @IsString()
  @IsOptional()
  requirements?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  commitment?: string;

  // Cho phép clientId từ body nếu không có auth (dev mode)
  @IsString()
  @IsOptional()
  clientId?: string;
}

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'ON_HOLD'])
  @IsOptional()
  status?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;
}

export class AddFundsDto {
  @IsNumber()
  @Min(1)
  amount: number;
}
