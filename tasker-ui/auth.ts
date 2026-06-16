
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // callbacks: {
  //   async jwt({ token, account }) {
  //     console.log(token, account);

  //     if (account?.id_token) {
  //       const res = await fetch(`${process.env.NESTJS_API_URL}/auth/google`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ idToken: account.id_token }),
  //       });
  //       const data = await res.json();
  //       token.accessToken = data.access_token; // JWT từ NestJS
  //       token.user = data.user;
  //     }
  //     return token;
  //   },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.id_token) {
        // mock fetch success
        const data = {
          access_token: "mock-nestjs-jwt-token-123456",
          user: {
            id: "user_001",
            email: "nam@example.com",
            name: "Nam",
            role: "USER",
          },
        };

        token.accessToken = data.access_token;
        token.user = data.user;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user
      return session;
    },
  },
})



// import NextAuth, { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// // Helper kiểm tra token còn hạn không
// function isAccessTokenExpired(token: any): boolean {
//   return Date.now() > token.accessTokenExpires;
// }

// // Gọi NestJS refresh endpoint
// async function refreshAccessToken(token: any) {
//   try {
//     const res = await fetch(`${process.env.NESTJS_API_URL}/auth/refresh`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ refreshToken: token.refreshToken }),
//     });

//     if (!res.ok) throw new Error("Refresh failed");

//     const data = await res.json();

//     return {
//       ...token,
//       accessToken: data.access_token,
//       accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 phút
//     };
//   } catch {
//     // Refresh thất bại → force logout
//     return { ...token, error: "RefreshTokenExpired" };
//   }
// }

// export const authOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],

//   callbacks: {
//     async jwt({ token, account }) {
//       // Lần đầu sign in
//       if (account?.id_token) {
//         const res = await fetch(`${process.env.NESTJS_API_URL}/auth/google`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ idToken: account.id_token }),
//         });
//         const data = await res.json();

//         return {
//           ...token,
//           accessToken: data.access_token,
//           refreshToken: data.refresh_token,
//           accessTokenExpires: Date.now() + 15 * 60 * 1000,
//           user: data.user,
//         };
//       }

//       // Token còn hạn → trả về luôn
//       if (!isAccessTokenExpired(token)) {
//         return token;
//       }

//       // Token hết hạn → tự động refresh
//       return refreshAccessToken(token);
//     },

//     async session({ session, token }) {
//       session.user = token.user as any;
//       session.accessToken = token.accessToken as string;
//       session.error = token.error as string; // báo cho client biết nếu lỗi
//       return session;
//     },
//   },
// };