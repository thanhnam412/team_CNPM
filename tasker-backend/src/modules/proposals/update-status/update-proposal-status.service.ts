import { Inject, Injectable, BadRequestException, ForbiddenException } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import { ProposalsService } from "../proposals.service";
import { updateProposalStatusQuery } from "@/queries/proposals";
import { validateLogic } from "../core/utils/proposal";
import { ProposalSnapshot } from "../core/domain";

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
    const { clientId } = await this.proposalsService.resolveClientAndPrice(proposal, this.db);

    const snapshot: ProposalSnapshot = {
      id: proposal.id,
      status: proposal.status,
      clientId: clientId,
      expertId: proposal.expertId,
    };

    if (status === "WITHDRAWN") {
      validateLogic("WITHDRAW", snapshot, actorId);
    } else if (status === "REJECTED") {
      validateLogic("REJECT", snapshot, actorId);
    }

    return updateProposalStatusQuery(this.db, proposalId, status);
  }
}
