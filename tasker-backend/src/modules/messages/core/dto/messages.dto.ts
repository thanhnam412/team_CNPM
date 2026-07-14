import { IsString, IsOptional } from "class-validator";

export class SendMessageDto {
  @IsString()
  content: string;

  @IsOptional()
  attachments?: any;
}
