import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsUrl,
} from "class-validator";

export class UpsertExpertProfileDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsOptional()
  skills?: any;

  @IsNumber()
  @Min(0)
  @IsOptional()
  hourlyRate?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  experienceYears?: number;

  @IsUrl()
  @IsOptional()
  portfolioUrl?: string;
}

export class CreateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString()
  clientId: string;

  @IsString()
  @IsOptional()
  projectId?: string;
}
