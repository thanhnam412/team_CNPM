import { IsString, IsEnum } from "class-validator";

export class AddMemberDto {
  @IsString()
  userId: string;

  @IsEnum(["CLIENT_ADMIN", "CLIENT_MEMBER", "EXPERT"])
  role: string;
}
