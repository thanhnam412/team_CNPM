import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  findInvitationsByExpertQuery,
  findInvitationsByClientQuery,
} from "@/queries/invitations";

@Injectable()
export class InvitationsService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}



  async findByExpert(expertId: string) {
    return findInvitationsByExpertQuery(this.db, expertId);
  }

  async findByClient(clientId: string) {
    return findInvitationsByClientQuery(this.db, clientId);
  }


}
