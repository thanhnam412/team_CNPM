import { IsString, IsOptional, IsEnum } from "class-validator";

export class UpdateUserProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsOptional()
  online?: boolean;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsOptional()
  hourlyRate?: number;

  @IsOptional()
  skills?: any;

  @IsOptional()
  experienceYears?: number;

  @IsString()
  @IsOptional()
  portfolioUrl?: string;
}

export class SwitchRoleDto {
  @IsEnum(["CLIENT", "EXPERT"])
  role: "CLIENT" | "EXPERT";
}
