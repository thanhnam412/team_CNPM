import { Inject, Injectable, ForbiddenException } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "../../database/database.module";
import { DB } from "../../database/types";

@Injectable()
export class MessagesService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async getConversations(userId: string) {
    return this.db
      .selectFrom("conversations")
      .innerJoin(
        "conversation_participants",
        "conversation_participants.conversationId",
        "conversations.id",
      )
      .selectAll("conversations")
      .where("conversation_participants.userId", "=", userId)
      .execute();
  }

  async getMessages(conversationId: string) {
    return this.db
      .selectFrom("messages")
      .selectAll()
      .where("conversationId", "=", conversationId)
      .orderBy("createdAt", "asc")
      .execute();
  }

  async sendMessage(userId: string, conversationId: string, data: any) {
    const participant = await this.db
      .selectFrom("conversation_participants")
      .select("id")
      .where("conversationId", "=", conversationId)
      .where("userId", "=", userId)
      .executeTakeFirst();
    
    if (!participant) {
      throw new ForbiddenException("You are not a participant in this conversation");
    }

    return this.db
      .insertInto("messages")
      .values({
        id: crypto.randomUUID(),
        conversationId,
        senderId: userId,
        type: data.type || "TEXT",
        content: data.content,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        createdAt: new Date(),
      })
      .returningAll()
      .executeTakeFirst();
  }
}
