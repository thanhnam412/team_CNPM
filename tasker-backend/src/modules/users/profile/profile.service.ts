import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import { UpdateUserProfileDto } from "../core/dto/profile.dto";
import {
  getMeProfileQuery,
  switchRoleQuery,
  updateProfileQuery,
  getPublicProfileQuery,
} from "@/queries/users/profile";

@Injectable()
export class ProfileService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async getMeProfile(id: string) {
    return getMeProfileQuery(this.db, id);
  }

  async switchRole(id: string, role: "CLIENT" | "EXPERT") {
    return switchRoleQuery(this.db, id, role);
  }

  async updateProfile(id: string, data: UpdateUserProfileDto) {
    return updateProfileQuery(this.db, id, data);
  }

  async getPublicProfile(id: string) {
    return getPublicProfileQuery(this.db, id);
  }
}
