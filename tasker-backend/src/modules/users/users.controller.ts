import { Controller, Get, Patch, Param, Body, Req } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Request } from "express";

@Controller("api/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.usersService.findById(id);
  }

  @Get(":id/public")
  getPublicProfile(@Param("id") id: string) {
    return this.usersService.getPublicProfile(id);
  }

  @Patch(":id/switch-role")
  switchRole(@Param("id") id: string, @Body("role") role: "CLIENT" | "EXPERT") {
    return this.usersService.switchRole(id, role);
  }

  @Patch(":id")
  updateProfile(@Param("id") id: string, @Body() data: any) {
    return this.usersService.updateProfile(id, data);
  }
}
