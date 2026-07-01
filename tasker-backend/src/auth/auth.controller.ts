import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login') login(@Body() dto: { email: string; password: string; role?: string }) { return this.authService.login(dto.email, dto.password, dto.role); }
  @Post('register') register(@Body() dto: CreateUserDto) { return this.authService.register(dto); }
  @Post('google') googleLogin(@Body('idToken') idToken: string) { return this.authService.verifyGoogleToken(idToken); }
}
