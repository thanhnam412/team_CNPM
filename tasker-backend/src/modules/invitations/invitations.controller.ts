import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from "@nestjs/common";
import { InvitationsService } from "./invitations.service";
import { CreateInvitationService } from "./create/create-invitation.service";
import { UpdateInvitationStatusService } from "./update-status/update-invitation-status.service";

@Controller("api/invitations")
export class InvitationsController {
  constructor(
    private readonly invitationsService: InvitationsService,
    private readonly createInvitationService: CreateInvitationService,
    private readonly updateInvitationStatusService: UpdateInvitationStatusService,
  ) {}

  @Post()
  create(@Body() data: any) {
    return this.createInvitationService.execute(data);
  }

  @Get("expert/:expertId")
  findByExpert(@Param("expertId") expertId: string) {
    return this.invitationsService.findByExpert(expertId);
  }

  @Get("client/:clientId")
  findByClient(@Param("clientId") clientId: string) {
    return this.invitationsService.findByClient(clientId);
  }

  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body("status") status: "ACCEPTED" | "REJECTED" | "CANCELLED",
  ) {
    return this.updateInvitationStatusService.execute(id, status);
  }
}
