import { PublicExpertProfilePage } from "@/components/aitasker/final-pages";
export default function Page({ params }: { params: { id: string } }) { return <PublicExpertProfilePage id={params.id} />; }
