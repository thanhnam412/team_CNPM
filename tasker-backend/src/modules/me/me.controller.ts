import { Controller, Get, Req } from "@nestjs/common";
import { ProfileService } from "../users/profile/profile.service";
import { Request } from "express";

@Controller("api/me")
export class MeController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getMyProfile(@Req() req: Request) {
    // req.user được gán từ JwtStrategy (chứa userId, email)
    const userPayload: any = req.user;

    // Gọi DB lấy đúng 6 trường thông tin (id, email, name, currentRole, balance, avatar)
    return this.profileService.getMeProfile(userPayload.userId);
  }
}
