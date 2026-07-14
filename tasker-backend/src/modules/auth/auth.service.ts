import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { OAuth2Client } from "google-auth-library";
import { UsersService } from "@/modules/users/users.service";
import { TokenService } from "./token/token.service";
import { IdToken } from "./dto/google-login.dto";

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {}

  async verifyGoogleToken(idToken: string, device?: string) {
    let payload: IdToken | undefined;
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload() as IdToken;
    } catch {
      throw new UnauthorizedException("Invalid Google token");
    }

    if (!payload?.sub || !payload.email) {
      throw new UnauthorizedException("Incomplete Google payload");
    }

    const user = await this.usersService.findOrCreate({
      googleId: payload.sub,
      email: payload.email,
      name: payload.name ?? "",
      avatar: payload.picture,
    });

    return this.issueTokens(user.id, user.email, device);
  }

  async refreshAccessToken(refreshToken: string) {
    let payload: { sub: string };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException("Refresh token invalid or expired");
    }

    const isValid = await this.tokenService.validateRefreshToken(
      payload.sub,
      refreshToken,
    );
    if (!isValid) {
      throw new UnauthorizedException("Refresh token revoked");
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) throw new UnauthorizedException("User not found");

    // Tạo accessToken mới
    const access_token = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { secret: process.env.JWT_SECRET, expiresIn: "7d" },
    );

    const new_refresh_token = this.jwtService.sign(
      { sub: user.id },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: "30d" },
    );

    // Revoke token cũ, lưu token mới
    await this.tokenService.revokeRefreshToken(refreshToken);
    await this.tokenService.saveRefreshToken(user.id, new_refresh_token);

    return {
      access_token,
      refresh_token: new_refresh_token, // NextAuth sẽ lưu lại token mới này
    };
  }

  async logout(refreshToken: string) {
    await this.tokenService.revokeRefreshToken(refreshToken);
    return { success: true };
  }

  private async issueTokens(userId: string, email: string, device?: string) {
    const access_token = this.jwtService.sign(
      { sub: userId, email },
      { secret: process.env.JWT_SECRET, expiresIn: "7d" },
    );

    const refresh_token = this.jwtService.sign(
      { sub: userId },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: "30d" },
    );

    try {
      await this.tokenService.saveRefreshToken(userId, refresh_token, device);
    } catch {
      throw new InternalServerErrorException("Failed to save refresh token");
    }

    const user = await this.usersService.findById(userId);

    return {
      access_token,
      refresh_token,
      user: {
        id: user!.id,
        email: user!.email,
        name: user!.name,
        avatar: user!.avatar,
      },
    };
  }
}
