import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GoogleLoginDto, RefreshTokenDto } from "./dto/google-login.validate";
import { Public } from "./decorators/public.decorator";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("google")
  async googleLogin(@Body() dto: GoogleLoginDto) {
    return this.authService.verifyGoogleToken(dto.idToken, dto.device);
  }

  @Public()
  @Post("refresh")
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(dto.refreshToken);
  }

  @Post("logout")
  async logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken);
  }
}
