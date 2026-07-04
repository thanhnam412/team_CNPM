import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { KYSELY_DB } from '../../database/database.module';
import { DB } from '../../database/types';

@Injectable()
export class MessagesService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async getConversations(userId: string) {
    return this.db
      .selectFrom('conversations')
      .innerJoin('conversation_participants', 'conversation_participants.conversationId', 'conversations.id')
      .selectAll('conversations')
      .where('conversation_participants.userId', '=', userId)
      .execute();
  }

  async getMessages(conversationId: string) {
    return this.db
      .selectFrom('messages')
      .selectAll()
      .where('conversationId', '=', conversationId)
      .orderBy('createdAt', 'asc')
      .execute();
  }

  async sendMessage(userId: string, conversationId: string, data: any) {
    return this.db
      .insertInto('messages')
      .values({
        id: crypto.randomUUID(),
        conversationId,
        senderId: userId,
        type: data.type || 'TEXT',
        content: data.content,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        createdAt: new Date(),
      })
      .returningAll()
      .executeTakeFirst();
  }
}
