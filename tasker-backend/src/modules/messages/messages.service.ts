import { Inject, Injectable, ForbiddenException } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  getUserConversationsQuery,
  getConversationMessagesQuery,
  checkConversationParticipantQuery,
  insertMessageQuery,
} from "@/queries/messages";
import { SendMessageDto } from "./core/dto/messages.dto";

@Injectable()
export class MessagesService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async getConversations(userId: string) {
    return getUserConversationsQuery(this.db, userId);
  }

  async getMessages(conversationId: string) {
    return getConversationMessagesQuery(this.db, conversationId);
  }

  async sendMessage(
    userId: string,
    conversationId: string,
    data: SendMessageDto,
  ) {
    const participant = await checkConversationParticipantQuery(
      this.db,
      userId,
      conversationId,
    );

    if (!participant) {
      throw new ForbiddenException(
        "You are not a participant in this conversation",
      );
    }

    return insertMessageQuery(this.db, {
      ...data,
      conversationId,
      userId,
    });
  }
}
