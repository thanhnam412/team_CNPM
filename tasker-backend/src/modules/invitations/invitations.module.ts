import { Module } from "@nestjs/common";
import { DatabaseModule } from "@/database/database.module";
import { InvitationsController } from "./invitations.controller";
import { InvitationsService } from "./invitations.service";
import { CreateInvitationService } from "./create/create-invitation.service";
import { UpdateInvitationStatusService } from "./update-status/update-invitation-status.service";

@Module({
  imports: [DatabaseModule],
  controllers: [InvitationsController],
  providers: [
    InvitationsService,
    CreateInvitationService,
    UpdateInvitationStatusService,
  ],
  exports: [
    InvitationsService,
    CreateInvitationService,
    UpdateInvitationStatusService,
  ],
})
export class InvitationsModule {}
