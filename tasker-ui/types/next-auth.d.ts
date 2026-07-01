import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }

  // Khai báo lại interface User gốc của NextAuth
  interface User {
    id?: string;
    email?: string | null;
    name?: string | null;
    role?: string;
  }
}

// Giải quyết phần ép kiểu của Adapter bằng cách override lại thuộc tính emailVerified
declare module "@auth/core/adapters" {
  interface AdapterUser {
    emailVerified?: Date | string | null; // Biến trường này thành optional bằng dấu ?
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }
}