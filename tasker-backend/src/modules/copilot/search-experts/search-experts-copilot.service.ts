import { Injectable, Inject } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import { searchExpertsCopilotQuery } from "@/queries/copilot";

@Injectable()
export class SearchExpertsCopilotService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async execute(data: any, message: string) {
    const keywords = data.keywords || [];
    const skills = data.skills || [];
    const searchTerms = [...keywords, ...skills];

    const experts = await searchExpertsCopilotQuery(this.db, searchTerms);

    return {
      intent: "SEARCH_EXPERTS",
      experts: experts.map((e) => ({
        id: e.id,
        name: e.name,
        avatar: e.avatar,
        email: e.email,
        title: e.title,
        bio: e.bio,
        skills: e.skills,
        rate: e.hourlyRate,
      })),
      message,
    };
  }
}
