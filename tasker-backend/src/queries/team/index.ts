import { Kysely, Transaction } from 'kysely';
import { DB } from '@/database/types';

export const checkAdminQuery = async (db: Kysely<DB> | Transaction<DB>, userId: string, projectId: string) => {
  return db
    .selectFrom("project_members")
    .select("id")
    .where("projectId", "=", projectId)
    .where("userId", "=", userId)
    .where("role", "=", "CLIENT_ADMIN")
    .executeTakeFirst();
};

export const getTeamMembersQuery = async (db: Kysely<DB> | Transaction<DB>, projectId: string) => {
  return db
    .selectFrom("project_members")
    .innerJoin("users", "users.id", "project_members.userId")
    .select([
      "project_members.id",
      "project_members.userId",
      "project_members.role",
      "project_members.status",
      "project_members.rating",
      "users.name",
      "users.email",
      "users.avatar",
    ])
    .where("project_members.projectId", "=", projectId)
    .execute();
};

export const addTeamMemberQuery = async (db: Kysely<DB> | Transaction<DB>, projectId: string, data: any) => {
  return db
    .insertInto("project_members")
    .values({
      id: crypto.randomUUID(),
      projectId,
      userId: data.userId,
      role: data.role || "CLIENT_ADMIN",
      status: data.status || "ACTIVE",
      updatedAt: new Date().toISOString(),
    })
    .returningAll()
    .executeTakeFirst();
};

export const getTeamMemberProjectQuery = async (db: Kysely<DB> | Transaction<DB>, memberId: string) => {
  return db.selectFrom("project_members").select("projectId").where("id", "=", memberId).executeTakeFirst();
};

export const updateTeamMemberRoleQuery = async (db: Kysely<DB> | Transaction<DB>, memberId: string, role: string) => {
  return db
    .updateTable("project_members")
    .set({ role: role as any, updatedAt: new Date().toISOString() })
    .where("id", "=", memberId)
    .returningAll()
    .executeTakeFirst();
};

export const deleteTeamMemberQuery = async (db: Kysely<DB> | Transaction<DB>, memberId: string) => {
  return db
    .deleteFrom("project_members")
    .where("id", "=", memberId)
    .execute();
};
