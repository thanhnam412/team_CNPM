import { Body, Controller, Post, UseGuards, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GoogleLoginDto, RefreshTokenDto } from "./dto/google-login.validate";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("google")
  async googleLogin(@Body() dto: GoogleLoginDto) {
    return this.authService.verifyGoogleToken(dto.idToken, dto.device);
  }

  @Post("refresh")
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(dto.refreshToken);
  }

  @Post("logout")
  async logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @Post("me")
  @UseGuards(AuthGuard("jwt"))
  getMe(@Req() req: Request) {
    return req.user;
  }
}
