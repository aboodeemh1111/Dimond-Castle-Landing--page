"use client";
import { useAuth } from "../stores/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiAuthGet } from "../lib/api";
import { useState, useEffect } from "react";

type Contact = { _id: string; name: string; email: string; message: string; seen: boolean; createdAt?: string };

type ContactSettings = {
  titleEN?: string;
  titleAR?: string;
  subtitleEN?: string;
  subtitleAR?: string;
  businessHours?: string[];
  phoneNumbers?: string[];
  whatsappNumbers?: string[];
  emails?: string[];
  addressesEN?: string[];
  addressesAR?: string[];
  googleMapEmbedUrl?: string;
  socialLinks?: Record<string, string>;
};

export default function ContactsPage() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"messages" | "settings">("messages");

  // Messages query
  const { data: messages, isLoading: messagesLoading, error: messagesError } = useQuery({
    queryKey: ["admin-contact-messages"],
    queryFn: () => apiAuthGet<{ items: Contact[] }>("/contact/messages", accessToken || undefined),
    enabled: !!accessToken && activeTab === "messages",
  });

  // Settings query
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["admin-contact-settings"],
    queryFn: () => apiAuthGet<ContactSettings>("/contact/settings", accessToken || undefined),
    enabled: !!accessToken && activeTab === "settings",
  });

  // Settings mutation
  const saveSettings = useMutation({
    mutationFn: async (data: ContactSettings) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/contact/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contact-settings"] });
      alert("Settings saved successfully!");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Contact Management</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("messages")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "messages"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "settings"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Messages Tab */}
      {activeTab === "messages" && (
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
              {messagesLoading && <tr><td className="p-3" colSpan={5}>Loading...</td></tr>}
              {messagesError && <tr><td className="p-3 text-red-600" colSpan={5}>Failed to load.</td></tr>}
              {messages?.items?.length ? messages.items.map((c) => (
                <tr key={c._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.message.length > 48 ? c.message.slice(0,48)+"…" : c.message}</td>
                  <td className="p-3">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}</td>
                  <td className="p-3">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${c.seen ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {c.seen ? "Handled" : "New"}
                    </span>
                  </td>
                </tr>
              )) : (!messagesLoading && <tr><td className="p-3" colSpan={5}>No messages.</td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <ContactSettingsForm
          settings={settings || {}}
          isLoading={settingsLoading}
          onSave={(data) => saveSettings.mutate(data)}
          isSaving={saveSettings.isPending}
        />
      )}
    </div>
  );
}

function ContactSettingsForm({
  settings,
  isLoading,
  onSave,
  isSaving,
}: {
  settings: ContactSettings;
  isLoading: boolean;
  onSave: (data: ContactSettings) => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<ContactSettings>(settings);

  // Sync form when settings load
  useEffect(() => {
    if (settings && !isLoading) {
      setForm({
        titleEN: settings.titleEN || "",
        titleAR: settings.titleAR || "",
        subtitleEN: settings.subtitleEN || "",
        subtitleAR: settings.subtitleAR || "",
        phoneNumbers: settings.phoneNumbers || [],
        whatsappNumbers: settings.whatsappNumbers || [],
        emails: settings.emails || [],
        addressesEN: settings.addressesEN || [],
        addressesAR: settings.addressesAR || [],
        businessHours: settings.businessHours || [],
        googleMapEmbedUrl: settings.googleMapEmbedUrl || "",
        socialLinks: settings.socialLinks || {},
      });
    }
  }, [settings, isLoading]);

  const handleArrayChange = (field: keyof ContactSettings, index: number, value: string) => {
    const arr = (form[field] as string[]) || [];
    const newArr = [...arr];
    newArr[index] = value;
    setForm({ ...form, [field]: newArr });
  };

  const handleArrayAdd = (field: keyof ContactSettings) => {
    const arr = (form[field] as string[]) || [];
    setForm({ ...form, [field]: [...arr, ""] });
  };

  const handleArrayRemove = (field: keyof ContactSettings, index: number) => {
    const arr = (form[field] as string[]) || [];
    setForm({ ...form, [field]: arr.filter((_, i) => i !== index) });
  };

  if (isLoading) {
    return <div className="rounded-2xl bg-white shadow-sm p-6">Loading settings...</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clean up the form data before saving
    const cleaned: ContactSettings = {
      ...form,
      // Filter out empty strings from arrays
      phoneNumbers: (form.phoneNumbers || []).filter((s) => s.trim().length > 0),
      whatsappNumbers: (form.whatsappNumbers || []).filter((s) => s.trim().length > 0),
      emails: (form.emails || []).filter((s) => s.trim().length > 0),
      addressesEN: (form.addressesEN || []).filter((s) => s.trim().length > 0),
      addressesAR: (form.addressesAR || []).filter((s) => s.trim().length > 0),
      businessHours: (form.businessHours || []).filter((s) => s.trim().length > 0),
      // Handle optional string fields - convert empty strings to undefined
      titleEN: form.titleEN?.trim() || undefined,
      titleAR: form.titleAR?.trim() || undefined,
      subtitleEN: form.subtitleEN?.trim() || undefined,
      subtitleAR: form.subtitleAR?.trim() || undefined,
      googleMapEmbedUrl: form.googleMapEmbedUrl?.trim() || undefined,
    };
    onSave(cleaned);
  };

  return (
    <div className="rounded-2xl bg-white shadow-sm p-6 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Titles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title (English)</label>
            <input
              type="text"
              value={form.titleEN || ""}
              onChange={(e) => setForm({ ...form, titleEN: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Get in Touch"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title (Arabic)</label>
            <input
              type="text"
              value={form.titleAR || ""}
              onChange={(e) => setForm({ ...form, titleAR: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="تواصل معنا"
              dir="rtl"
            />
          </div>
        </div>

        {/* Subtitles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle (English)</label>
            <textarea
              value={form.subtitleEN || ""}
              onChange={(e) => setForm({ ...form, subtitleEN: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="We'd love to hear from you"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle (Arabic)</label>
            <textarea
              value={form.subtitleAR || ""}
              onChange={(e) => setForm({ ...form, subtitleAR: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="نحن نحب أن نسمع منك"
              dir="rtl"
            />
          </div>
        </div>

        {/* Phone Numbers */}
        <ArrayField
          label="Phone Numbers"
          items={form.phoneNumbers || []}
          onChange={(items) => setForm({ ...form, phoneNumbers: items })}
          placeholder="+966 50 123 4567"
        />

        {/* WhatsApp Numbers */}
        <ArrayField
          label="WhatsApp Numbers"
          items={form.whatsappNumbers || []}
          onChange={(items) => setForm({ ...form, whatsappNumbers: items })}
          placeholder="+966501234567"
        />

        {/* Emails */}
        <ArrayField
          label="Email Addresses"
          items={form.emails || []}
          onChange={(items) => setForm({ ...form, emails: items })}
          placeholder="contact@example.com"
          type="email"
        />

        {/* Addresses EN */}
        <ArrayField
          label="Addresses (English)"
          items={form.addressesEN || []}
          onChange={(items) => setForm({ ...form, addressesEN: items })}
          placeholder="123 Main St, City, Country"
        />

        {/* Addresses AR */}
        <ArrayField
          label="Addresses (Arabic)"
          items={form.addressesAR || []}
          onChange={(items) => setForm({ ...form, addressesAR: items })}
          placeholder="شارع الملك فهد، الرياض"
          dir="rtl"
        />

        {/* Business Hours */}
        <ArrayField
          label="Business Hours"
          items={form.businessHours || []}
          onChange={(items) => setForm({ ...form, businessHours: items })}
          placeholder="Mon-Fri: 9AM - 5PM"
        />

        {/* Google Map Embed URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Google Map Embed URL</label>
          <input
            type="url"
            value={form.googleMapEmbedUrl || ""}
            onChange={(e) => setForm({ ...form, googleMapEmbedUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Get embed URL from Google Maps → Share → Embed a map
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ArrayField({
  label,
  items,
  onChange,
  placeholder,
  type = "text",
  dir,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  type?: string;
  dir?: "rtl" | "ltr";
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          + Add
        </button>
      </div>
      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-gray-400 italic">No items yet. Click "Add" to create one.</p>
        )}
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type={type}
              value={item}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index] = e.target.value;
                onChange(newItems);
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={placeholder}
              dir={dir}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

