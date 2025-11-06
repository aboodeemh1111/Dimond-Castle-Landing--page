import { Metadata } from "next";
import { PageEditor } from "../../components/pages/PageEditor";

export const metadata: Metadata = { title: "Create Page | Dimond Castle Admin" };

export default function NewPage() {
  return <PageEditor />;
}
