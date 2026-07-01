import { ServiceDetailPage } from "@/components/aitasker/landing";
export default function Page({ params }: { params: { slug: string } }) { return <ServiceDetailPage slug={params.slug} />; }
