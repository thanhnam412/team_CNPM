import NextAuth, { User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

const ACCESS_TOKEN_EXPIRE = 7 * 24 * 60 * 60;

type AuthError = "RefreshAccessTokenError" | "LoginError";

type ExtendedJWT = JWT & {
  accessToken?: string | null;
  refreshToken?: string;
  accessTokenExpires?: number;
  error?: AuthError;
  user?: User;
};

async function refreshAccessToken(refreshToken: string) {
  try {
    const res = await fetch(`${process.env.NESTJS_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(`Refresh failed: ${res.status}`);

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? refreshToken,
      accessTokenExpires: Date.now() + ACCESS_TOKEN_EXPIRE * 1000,
      error: undefined,
    };
  } catch (err) {
    console.error("[refreshAccessToken] error:", err);
    return {
      accessToken: null,
      refreshToken,
      accessTokenExpires: 0,
      error: "RefreshAccessTokenError" as const,
    };
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, account }): Promise<ExtendedJWT> {
      if (account?.id_token) {
        try {
          const res = await fetch(
            `${process.env.NESTJS_BASE_URL}/auth/google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken: account.id_token }),
            },
          );

          if (!res.ok) {
            const errorText = await res.text();
            console.error(`NestJS API Error (${res.status}):`, errorText);
            return {
              ...token,
              error: "LoginError" as AuthError,
            } as ExtendedJWT;
          }

          const data = await res.json();

          return {
            ...token,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            accessTokenExpires: Date.now() + ACCESS_TOKEN_EXPIRE * 1000,
            user: data.user,
            error: undefined,
          } as ExtendedJWT;
        } catch (error) {
          console.error("Connection Error NestJS API:", error);
          return { ...token, error: "LoginError" as AuthError } as ExtendedJWT;
        }
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token as ExtendedJWT;
      }

      const refreshed = await refreshAccessToken(token.refreshToken as string);

      return {
        ...token,
        ...refreshed,
      } as ExtendedJWT;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.error = token.error as AuthError | undefined;

      if (token.user) {
        session.user = token.user as typeof session.user;
      }

      return session;
    },
  },
});
