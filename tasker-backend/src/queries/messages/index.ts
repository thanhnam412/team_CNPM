import { Kysely, Transaction } from 'kysely';
import { DB } from '@/database/types';

export const getUserConversationsQuery = async (db: Kysely<DB> | Transaction<DB>, userId: string) => {
  return db
    .selectFrom("conversations")
    .innerJoin(
      "conversation_participants",
      "conversation_participants.conversationId",
      "conversations.id",
    )
    .selectAll("conversations")
    .where("conversation_participants.userId", "=", userId)
    .execute();
};

export const getConversationMessagesQuery = async (db: Kysely<DB> | Transaction<DB>, conversationId: string) => {
  return db
    .selectFrom("messages")
    .selectAll()
    .where("conversationId", "=", conversationId)
    .orderBy("createdAt", "asc")
    .execute();
};

export const checkConversationParticipantQuery = async (db: Kysely<DB> | Transaction<DB>, userId: string, conversationId: string) => {
  return db
    .selectFrom("conversation_participants")
    .select("id")
    .where("conversationId", "=", conversationId)
    .where("userId", "=", userId)
    .executeTakeFirst();
};

export const insertMessageQuery = async (db: Kysely<DB> | Transaction<DB>, data: any) => {
  return db
    .insertInto("messages")
    .values({
      id: crypto.randomUUID(),
      conversationId: data.conversationId,
      senderId: data.userId,
      type: data.type || "TEXT",
      content: data.content,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      createdAt: new Date().toISOString(),
    })
    .returningAll()
    .executeTakeFirst();
};
