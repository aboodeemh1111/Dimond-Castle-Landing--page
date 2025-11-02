export default function BlogEditPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit Blog Post</h1>
      <div className="rounded-2xl bg-white shadow-sm p-5 text-sm text-gray-600">
        Editor for ID: <code>{params.id}</code> — coming soon.
      </div>
    </div>
  );
}

