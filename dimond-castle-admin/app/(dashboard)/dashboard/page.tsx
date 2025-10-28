"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, CheckCircle, Clock } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import type { BlogDoc } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
  });
  const [recentBlogs, setRecentBlogs] = useState<BlogDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { blogs, total } = await api.getBlogs({ limit: 5 });

        const published = blogs.filter((b) => b.status === "published").length;
        const drafts = blogs.filter((b) => b.status === "draft").length;

        setStats({
          total,
          published,
          drafts,
        });
        setRecentBlogs(blogs);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: "Total Blogs",
      value: stats.total,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Published",
      value: stats.published,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Drafts",
      value: stats.drafts,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-admin-textLight">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-admin-textLight mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-admin-text">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Blogs */}
      <Card header={<h3 className="text-lg font-semibold">Recent Blogs</h3>}>
        {recentBlogs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-admin-textLight mb-4">No blogs yet</p>
            <Link
              href="/blogs/new"
              className="text-admin-primary hover:underline"
            >
              Create your first blog
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentBlogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blogs/${blog._id}`}
                className="block p-4 border border-admin-border rounded-lg hover:border-admin-primary transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-admin-text mb-1">
                      {blog.en.title}
                    </h4>
                    {blog.en.excerpt && (
                      <p className="text-sm text-admin-textLight line-clamp-2">
                        {blog.en.excerpt}
                      </p>
                    )}
                    <p className="text-xs text-admin-textLight mt-2">
                      Updated {new Date(blog.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={blog.status}>{blog.status}</Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
