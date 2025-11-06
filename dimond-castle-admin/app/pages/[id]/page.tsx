import { Metadata } from "next";
import { PageEditor } from "../../components/pages/PageEditor";

type EditProps = { params: { id: string } };

export async function generateMetadata({ params }: EditProps): Promise<Metadata> {
  return { title: `Edit Page ${params.id} | Dimond Castle Admin` };
}

export default function EditPage({ params }: EditProps) {
  return <PageEditor pageId={params.id} />;
}
