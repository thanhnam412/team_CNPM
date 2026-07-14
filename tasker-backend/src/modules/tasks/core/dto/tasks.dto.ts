import { IsString, IsOptional, IsEnum } from "class-validator";

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsEnum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"])
  @IsOptional()
  status?: string;

  @IsEnum(["LOW", "MEDIUM", "HIGH"])
  @IsOptional()
  priority?: string;

  @IsString()
  @IsOptional()
  milestoneId?: string;

  @IsString()
  @IsOptional()
  assigneeId?: string;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  assigneeId?: string;

  @IsString()
  @IsOptional()
  milestoneId?: string;

  @IsEnum(["LOW", "MEDIUM", "HIGH"])
  @IsOptional()
  priority?: string;
}

export class UpdateTaskStatusDto {
  @IsEnum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"])
  status: string;
}
