import type { ColumnType } from "kysely";
export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type RefreshToken = {
  id: string;
  token: string;
  userId: string;
  device: string | null;
  expiresAt: Timestamp;
  createdAt: Generated<Timestamp>;
};
export type User = {
  id: string;
  googleId: string;
  email: string;
  name: string;
  avatar: string | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
};
export type DB = {
  refresh_tokens: RefreshToken;
  users: User;
};
