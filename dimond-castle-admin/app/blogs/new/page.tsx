import { Metadata } from "next";
import { BlogEditor } from "../../components/blog/BlogEditor";

export const metadata: Metadata = {
  title: "Create Blog | Dimond Castle Admin",
};

export default function NewBlogPage() {
  return <BlogEditor />;
}
