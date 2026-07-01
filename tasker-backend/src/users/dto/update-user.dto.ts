import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
export class UpdateUserDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsBoolean() verified?: boolean;
  @IsOptional() @IsBoolean() blocked?: boolean;
  @IsOptional() @IsNumber() trustScore?: number;
}
