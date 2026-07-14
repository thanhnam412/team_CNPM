import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";

import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import { GoogleUserInput } from "./core/dto/users.dto";
import {
  findByIdQuery,
  findByGoogleIdQuery,
  findOrCreateQuery,
} from "@/queries/users/core";

@Injectable()
export class UsersService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async findById(id: string) {
    return findByIdQuery(this.db, id);
  }

  async findByGoogleId(googleId: string) {
    return findByGoogleIdQuery(this.db, googleId);
  }

  async findOrCreate(input: GoogleUserInput) {
    return findOrCreateQuery(this.db, input);
  }
}
