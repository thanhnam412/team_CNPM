import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { OAuth2Client } from "google-auth-library";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async verifyGoogleToken(idToken: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) throw new UnauthorizedException();

      // Upsert user vào database
      const user = await this.usersService.findOrCreate({
        googleId: payload.sub,
        email: payload.email!,
        name: payload.name!,
        avatar: payload.picture,
      });

      // Trả về JWT của NestJS
      const access_token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
      });

      return { access_token, user };
    } catch {
      throw new UnauthorizedException("Invalid Google token");
    }
  }
}
