import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  saveRefreshTokenQuery,
  validateRefreshTokenQuery,
  revokeRefreshTokenQuery,
  revokeAllUserTokensQuery,
} from "@/queries/auth/token";

@Injectable()
export class TokenService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async saveRefreshToken(userId: string, token: string, device?: string) {
    return saveRefreshTokenQuery(this.db, userId, token, device);
  }

  async validateRefreshToken(userId: string, token: string) {
    return validateRefreshTokenQuery(this.db, userId, token);
  }

  async revokeRefreshToken(token: string) {
    return revokeRefreshTokenQuery(this.db, token);
  }

  async revokeAllUserTokens(userId: string) {
    return revokeAllUserTokensQuery(this.db, userId);
  }
}
