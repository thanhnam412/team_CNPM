import { Inject, Injectable, BadRequestException, ForbiddenException } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import { ProposalsService } from "../proposals.service";
import { updateProposalStatusQuery } from "@/queries/proposals";

@Injectable()
export class UpdateProposalStatusService {
  constructor(
    @Inject(KYSELY_DB) private db: Kysely<DB>,
    private readonly proposalsService: ProposalsService,
  ) {}

  async execute(
    actorId: string,
    proposalId: string,
    status: "REJECTED" | "WITHDRAWN",
  ) {
    if (status !== "REJECTED" && status !== "WITHDRAWN") {
      throw new BadRequestException(
        "Status can only be updated to REJECTED or WITHDRAWN via this endpoint.",
      );
    }

    const proposal = await this.proposalsService.findByIdOrThrow(proposalId);

    if (status === "WITHDRAWN") {
      if (proposal.expertId !== actorId) {
        throw new ForbiddenException(
          "Only the expert can withdraw their proposal.",
        );
      }
    } else if (status === "REJECTED") {
      const { clientId } = await this.proposalsService.resolveClientAndPrice(proposal, this.db);
      if (clientId !== actorId) {
        throw new ForbiddenException(
          "Only the client can reject this proposal.",
        );
      }
    }

    return updateProposalStatusQuery(this.db, proposalId, status);
  }
}
