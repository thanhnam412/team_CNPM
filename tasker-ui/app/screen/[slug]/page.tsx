import { ScreenReplicaPage } from "@/components/aitasker/workflows";
export default function Page({ params }: { params: { slug: string } }) { return <ScreenReplicaPage slug={params.slug} />; }
