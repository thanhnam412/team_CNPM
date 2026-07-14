import { IsString, IsOptional, IsNumber, Min } from "class-validator";

export class CreateMilestoneDto {
  @IsString()
  title: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;
}

export class UpdateMilestoneDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;
}

export class SubmitDeliverablesDto {
  @IsString()
  @IsOptional()
  message?: string;

  @IsOptional()
  attachments?: any;
}
