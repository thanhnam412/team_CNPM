import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Req,
  ForbiddenException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { ProfileService } from "./profile/profile.service";
import { UpdateUserProfileDto, SwitchRoleDto } from "./core/dto/profile.dto";

@Controller("api/users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly profileService: ProfileService,
  ) {}

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.usersService.findById(id);
  }

  @Get(":id/public")
  getPublicProfile(@Param("id") id: string) {
    return this.profileService.getPublicProfile(id);
  }

  @Patch(":id/switch-role")
  switchRole(@Req() req, @Param("id") id: string, @Body() body: SwitchRoleDto) {
    if (req.user.userId !== id) throw new ForbiddenException("Not allowed");
    return this.profileService.switchRole(id, body.role);
  }

  @Patch(":id")
  updateProfile(
    @Req() req,
    @Param("id") id: string,
    @Body() data: UpdateUserProfileDto,
  ) {
    if (req.user.userId !== id) throw new ForbiddenException("Not allowed");
    return this.profileService.updateProfile(id, data);
  }
}
