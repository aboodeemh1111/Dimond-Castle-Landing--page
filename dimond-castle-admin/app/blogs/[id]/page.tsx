import { Metadata } from "next";
import { BlogEditor } from "../../components/blog/BlogEditor";

type BlogEditPageProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: BlogEditPageProps): Promise<Metadata> {
  return {
    title: `Edit Blog ${params.id} | Dimond Castle Admin`,
  };
}

export default function BlogEditPage({ params }: BlogEditPageProps) {
  return <BlogEditor blogId={params.id} />;
}
