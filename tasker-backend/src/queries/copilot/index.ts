import { Kysely } from "kysely";
import { DB } from "@/database/types";

export const insertProjectCopilotQuery = async (db: Kysely<DB>, data: any) => {
  return db.insertInto("projects").values(data).execute();
};

export const insertProjectMemberCopilotQuery = async (
  db: Kysely<DB>,
  data: any,
) => {
  return db.insertInto("project_members").values(data).execute();
};

export const insertMilestoneCopilotQuery = async (
  db: Kysely<DB>,
  data: any,
) => {
  return db.insertInto("milestones").values(data).execute();
};

export const insertTaskCopilotQuery = async (db: Kysely<DB>, data: any) => {
  return db.insertInto("tasks").values(data).execute();
};

export const getProjectCopilotQuery = async (
  db: Kysely<DB>,
  projectId: string,
) => {
  return db
    .selectFrom("projects")
    .selectAll()
    .where("id", "=", projectId)
    .executeTakeFirst();
};

export const searchExpertsCopilotQuery = async (
  db: Kysely<DB>,
  searchTerms: string[],
) => {
  let query = db
    .selectFrom("users")
    .innerJoin("expert_profiles", "expert_profiles.userId", "users.id")
    .select([
      "users.id",
      "users.name",
      "users.avatar",
      "users.email",
      "expert_profiles.title",
      "expert_profiles.bio",
      "expert_profiles.skills",
      "expert_profiles.hourlyRate",
    ]);

  if (searchTerms.length > 0) {
    query = query.where((eb) => {
      const clauses = searchTerms.map((term: string) =>
        eb("expert_profiles.bio", "ilike", `%${term}%`).or(
          "expert_profiles.title",
          "ilike",
          `%${term}%`,
        ),
      );
      return eb.or(clauses);
    });
  }

  return query.limit(10).execute();
};

export const insertQuickTaskCopilotQuery = async (
  db: Kysely<DB>,
  data: any,
) => {
  return db.insertInto("quick_tasks").values(data).execute();
};
