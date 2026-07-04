import "next-auth";
import "next-auth/jwt";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: "RefreshAccessTokenError" | "LoginError";
    user: {
      id: string;
      email: string;
      name?: string;
      role?: string;
      avatar?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    email?: string | null;
    name?: string | null;
    role?: string;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    emailVerified?: Date | string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: "RefreshAccessTokenError" | "LoginError";
    user?: {
      id: string;
      email: string;
      name?: string;
      role?: string;
      avatar?: string;
    };
  }
}
