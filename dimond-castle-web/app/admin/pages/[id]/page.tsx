export default function PageEdit({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit Page</h1>
      <div className="rounded-2xl bg-white shadow-sm p-5 text-sm text-gray-600">
        Builder for ID: <code>{params.id}</code> — coming soon.
      </div>
    </div>
  );
}

