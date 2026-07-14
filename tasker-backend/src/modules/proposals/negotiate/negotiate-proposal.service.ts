import { Inject, Injectable, BadRequestException, ForbiddenException } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import { ProposalsService } from "../proposals.service";
import { findNegotiationsForProposalQuery, insertProposalNegotiationQuery } from "@/queries/proposals";
import { ActorRole, DealContext } from "@/modules/proposals/core/domain";
import { validateLogic } from "../core/utils/proposal";

@Injectable()
export class NegotiateProposalService {
  constructor(
    @Inject(KYSELY_DB) private db: Kysely<DB>,
    private readonly proposalsService: ProposalsService,
  ) {}

  async execute(
    actorId: string,
    proposalId: string,
    offeredPrice: number,
  ) {
    return this.db.transaction().execute(async (trx) => {
      const proposal = await this.proposalsService.findByIdOrThrow(proposalId, trx);
      if (proposal.status !== "PENDING") {
        throw new BadRequestException("Can only negotiate on PENDING proposals.");
      }

      const { clientId, price: initialBudget } = await this.proposalsService.resolveClientAndPrice(proposal, trx);
      
      let role: ActorRole;
      if (actorId === clientId) {
        role = "CLIENT";
      } else if (actorId === proposal.expertId) {
        role = "EXPERT";
      } else {
        throw new ForbiddenException("You are not part of this proposal.");
      }

      // Fetch negotiation history
      const history = await findNegotiationsForProposalQuery(trx, proposalId);
      
      const lastClientOffer = history.reverse().find(h => h.actorRole === "CLIENT")?.offeredPrice;
      const lastExpertOffer = history.find(h => h.actorRole === "EXPERT")?.offeredPrice;

      const context: DealContext = {
        initialTaskBudget: initialBudget,
        initialExpertBid: Number(proposal.proposedPrice),
        lastClientOffer: lastClientOffer ? Number(lastClientOffer) : undefined,
        lastExpertOffer: lastExpertOffer ? Number(lastExpertOffer) : undefined,
      };

      // Validate logic layer
      validateLogic("COUNTER_OFFER", context, role, offeredPrice);

      // Insert new negotiation
      const negotiation = await insertProposalNegotiationQuery(
        trx,
        proposalId,
        actorId,
        role,
        offeredPrice,
      );

      // We might want to update the proposal's proposedPrice to the latest negotiated price
      // so when it's accepted, it takes the latest price.
      await trx.updateTable("proposals")
        .set({ proposedPrice: offeredPrice.toString(), updatedAt: new Date().toISOString() })
        .where("id", "=", proposalId)
        .execute();

      return negotiation;
    });
  }
}
