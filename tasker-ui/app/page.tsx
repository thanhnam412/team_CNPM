"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();
  console.log(session);
  

  if (session) {
    return (
      <div>
        <p>Xin chào, {session.user.name}</p>
        <button onClick={() => signOut()}>Đăng xuất</button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn("google")}>Đăng nhập bằng Google</button>
  );
}
