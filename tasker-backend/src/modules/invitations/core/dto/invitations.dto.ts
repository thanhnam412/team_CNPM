import { IsString, IsOptional, IsNumber, Min } from "class-validator";

export class CreateInvitationDto {
  @IsString()
  clientId: string;

  @IsString()
  expertId: string;

  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  taskId?: string;

  @IsString()
  @IsOptional()
  quickTaskId?: string;

  @IsString()
  @IsOptional()
  milestoneId?: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;
}
