import {
  Inject,
  Injectable,
  BadRequestException,
} from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  getInvitationQuery,
  insertInvitationQuery,
} from "@/queries/invitations";
import { CreateInvitationDto } from "../core/dto/invitations.dto";

@Injectable()
export class CreateInvitationService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async execute(data: CreateInvitationDto) {
    if (data.clientId === data.expertId) {
      throw new BadRequestException(
        "You cannot invite yourself to a task or project.",
      );
    }

    const projectId = data.projectId || null;
    const quickTaskId = data.taskId || data.quickTaskId || null;
    const milestoneId = data.milestoneId || null;

    if (!projectId && !quickTaskId && !milestoneId) {
      throw new BadRequestException(
        "Invitation must target a project, milestone, or quick task.",
      );
    }

    // Check for duplicates
    const existing = await getInvitationQuery(this.db, {
      clientId: data.clientId,
      expertId: data.expertId,
      quickTaskId,
      milestoneId,
      projectId,
    });

    if (existing) {
      throw new BadRequestException(
        "You have already sent an invitation to this expert for this task/project.",
      );
    }

    return insertInvitationQuery(this.db, {
      id: crypto.randomUUID(),
      clientId: data.clientId,
      expertId: data.expertId,
      projectId: data.projectId || null,
      quickTaskId: data.taskId || data.quickTaskId || null,
      milestoneId: data.milestoneId || null,
      message: data.message || null,
      budget: data.budget?.toString() || null,
      status: "PENDING",
      updatedAt: new Date(),
    });
  }
}
