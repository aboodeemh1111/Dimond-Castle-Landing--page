"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiAuthPost } from "../admin/lib/api";
import { useAuth } from "../admin/stores/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const { setAuth } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await apiAuthPost<{ token: string; user: any }>(
        "/auth/login",
        data
      );
      setAuth(res.token, res.user);
      toast.success("Welcome back!");
      router.replace("/admin/dashboard");
    } catch (e: any) {
      toast.error(e?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-cream text-textDark flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-sm p-8">
        <div className="text-2xl font-semibold mb-6 text-center">Admin Login</div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[--color-gold-500]"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[--color-gold-500]"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 rounded-xl bg-brand-gold-500 text-white hover:bg-brand-gold-600 transition disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

