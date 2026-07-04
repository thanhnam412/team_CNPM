/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "../../database/database.module";
import { DB } from "../../database/types";

@Injectable()
export class FinanceService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async getTransactions(userId: string) {
    return this.db
      .selectFrom("transactions")
      .selectAll()
      .where("userId", "=", userId)
      .orderBy("date", "desc")
      .execute();
  }

  async createTransaction(userId: string, data: any) {
    return this.db
      .insertInto("transactions")
      .values({
        id: crypto.randomUUID(),
        userId,
        desc: data.desc,
        type: data.type,
        amount: data.amount?.toString() || '0',
        balanceAfter: data.balanceAfter?.toString() || '0',
        source: data.source,
        date: new Date(),
        createdAt: new Date(),
      })
      .returningAll()
      .executeTakeFirst();
  }
}
