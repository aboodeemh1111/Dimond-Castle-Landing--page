"use client";
import { useAuth } from "../stores/auth";
import { useQuery } from "@tanstack/react-query";
import { apiAuthGet } from "../lib/api";

type Contact = { _id: string; name: string; email: string; message: string; seen: boolean; createdAt?: string };

export default function ContactsPage() {
  const { accessToken } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: () => apiAuthGet<Contact[]>("/contacts", accessToken || undefined),
    enabled: !!accessToken,
  });
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Contacts</h1>
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Message</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td className="p-3" colSpan={5}>Loading...</td></tr>}
            {error && <tr><td className="p-3 text-red-600" colSpan={5}>Failed to load.</td></tr>}
            {data?.length ? data.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.message.length > 48 ? c.message.slice(0,48)+"…" : c.message}</td>
                <td className="p-3">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}</td>
                <td className="p-3">{c.seen ? "Handled" : "New"}</td>
              </tr>
            )) : (!isLoading && <tr><td className="p-3" colSpan={5}>No messages.</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

