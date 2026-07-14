import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { MeController } from "../me/me.controller";
import { UsersService } from "./users.service";
import { ProfileService } from "./profile/profile.service";

@Module({
  controllers: [UsersController, MeController],
  providers: [UsersService, ProfileService],
  exports: [UsersService],
})
export class UsersModule {}
