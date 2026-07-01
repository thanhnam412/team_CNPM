import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { toUser } from '../common/mongo-mappers';

@Injectable()
export class AuthService {
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  constructor(private jwtService: JwtService, private usersService: UsersService) {}

  private sign(user: any) {
    const safeUser = user.passwordHash ? toUser(user) : user;
    const access_token = this.jwtService.sign({
  sub: safeUser.id,
  email: safeUser.email,
  role: safeUser.role,
});
    return { access_token, user: safeUser };
  }

  async login(email: string, password: string, role?: string) {
    const user = await this.usersService.findDocumentByEmail(email);
    if (!user || user.isBlocked || (role && user.role !== role)) throw new UnauthorizedException('Invalid credentials or blocked account');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    user.lastLoginAt = new Date();
    await user.save();
    return this.sign(user);
  }

  async register(dto: CreateUserDto) {
    const existing = await this.usersService.findDocumentByEmail(dto.email);
    if (existing) return this.sign(existing);
    const user = await this.usersService.create(dto);
    return this.sign(user);
  }

  async verifyGoogleToken(idToken: string) {
    try {
      const ticket = await this.client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
      const payload = ticket.getPayload();
      if (!payload) throw new UnauthorizedException();
      const user = await this.usersService.findOrCreate({ googleId: payload.sub, email: payload.email!, name: payload.name!, avatar: payload.picture });
      return this.sign(user);
    } catch {
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}
