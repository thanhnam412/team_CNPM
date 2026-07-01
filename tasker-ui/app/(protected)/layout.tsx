import { RoleLayout } from "@/components/aitasker/role-layout";
export default function ProtectedLayout({ children }: { children: React.ReactNode }) { return <RoleLayout role="client">{children}</RoleLayout>; }
