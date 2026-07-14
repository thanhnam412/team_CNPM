import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth-guards.service";

@Controller("api/clients")
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get("me/overview")
  async getOverview(@Req() req) {
    return this.clientsService.getOverview(req.user.userId);
  }
}
