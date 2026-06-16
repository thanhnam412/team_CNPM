import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { auth } from "@/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/");

  return <>{children}</>;
}
