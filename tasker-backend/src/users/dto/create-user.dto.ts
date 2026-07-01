import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import type { Role } from '../../common/roles.decorator';

export class CreateUserDto {
  @IsString() name!: string;
  @IsEmail() email!: string;
  @IsOptional() @MinLength(6) password?: string;
  @IsIn(['client', 'expert', 'enterprise', 'admin']) role!: Role;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() company?: string;
}
