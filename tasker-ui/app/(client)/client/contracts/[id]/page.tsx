import { ContractWorkspaceFull } from "@/components/aitasker/contract-workspace-full";
export default function Page({ params }: { params: { id: string } }) { return <ContractWorkspaceFull id={params.id} role="client" />; }
