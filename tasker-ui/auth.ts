import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
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
            return token;
          }

          const data = await res.json();
          token.accessToken = data.access_token;
          token.user = data.user;
        } catch (error) {
          console.error("Connection Error NestJS API:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    },
  },
});
