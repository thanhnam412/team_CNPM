import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const ACCESS_TOKEN_EXPIRE = 7 * 24 * 60 * 60; // 7 days (seconds)

type AuthError = "RefreshAccessTokenError" | "LoginError";

async function refreshAccessToken(refreshToken: string) {
  try {
    const res = await fetch(`${process.env.NESTJS_API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) throw new Error("Refresh failed");

    const data = await res.json();
    return {
      accessToken: data.access_token,
      // NestJS trả về refreshToken mới nếu có rotation, không thì giữ cũ
      refreshToken: data.refresh_token ?? refreshToken,
      accessTokenExpires: Date.now() + ACCESS_TOKEN_EXPIRE * 1000,
      error: undefined,
    };
  } catch {
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
    // Session tồn tại 30 ngày — bằng với thời hạn refreshToken của Backend
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, account }) {
      // Lần đầu đăng nhập — gọi NestJS để đổi Google idToken
      if (account?.id_token) {
        try {
          const res = await fetch(`${process.env.NESTJS_API_URL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: account.id_token }),
          });

          if (!res.ok) {
            const errorText = await res.text();
            console.error(`NestJS API Error (${res.status}):`, errorText);
            return { ...token, error: "LoginError" as AuthError };
          }

          const data = await res.json();

          return {
            ...token,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            accessTokenExpires: Date.now() + ACCESS_TOKEN_EXPIRE * 1000,
            user: data.user,
            error: undefined,
          };
        } catch (error) {
          console.error("Connection Error NestJS API:", error);
          return { ...token, error: "LoginError" as AuthError };
        }
      }

      // accessToken còn hạn — trả về luôn
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // accessToken hết hạn — tự động refresh
      // Trường hợp này xảy ra khi user quay lại sau 15 phút+
      console.log("Access token expired, refreshing...");
      const refreshed = await refreshAccessToken(token.refreshToken as string);

      return {
        ...token,
        ...refreshed,
      };
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
