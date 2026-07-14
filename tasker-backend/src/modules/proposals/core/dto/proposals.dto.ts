import { IsString, IsOptional, IsNumber, Min, IsInt } from "class-validator";

export class CreateProposalDto {
  @IsString()
  coverLetter: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  proposedPrice?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  estimatedDays?: number;

  // Fallback cho dev mode (không có auth)
  @IsString()
  @IsOptional()
  expertId?: string;
}

export class UpdateProposalStatusDto {
  status: "REJECTED" | "WITHDRAWN";
}

export class NegotiateProposalDto {
  @IsNumber()
  @Min(0)
  offeredPrice: number;
}
