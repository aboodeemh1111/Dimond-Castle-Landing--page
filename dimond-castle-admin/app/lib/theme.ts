import { z } from "zod";

export type ThemeSettings = {
  brandPrimary: string;
  brandSecondary: string;
  brandAccent: string;
  background: string;
  text: string;
  fontFamily: string; // name only for preview; real font integration is separate
  darkModeDefault: boolean;
  logoPublicId?: string;
  faviconPublicId?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
};

const hex = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Enter a valid hex color, e.g. #10b981");

export const themeSchema = z.object({
  brandPrimary: hex,
  brandSecondary: hex,
  brandAccent: hex,
  background: hex,
  text: hex,
  fontFamily: z.string().min(1),
  darkModeDefault: z.boolean(),
  logoPublicId: z.string().optional(),
  faviconPublicId: z.string().optional(),
  social: z
    .object({
      twitter: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      facebook: z.string().url().optional(),
    })
    .partial()
    .optional(),
});

export type ThemeInput = z.infer<typeof themeSchema>;

const DEFAULT_THEME: ThemeSettings = {
  brandPrimary: "#059669", // emerald-600
  brandSecondary: "#065f46", // emerald-800
  brandAccent: "#ca8a04", // amber-600
  background: "#ffffff",
  text: "#0f172a", // slate-900
  fontFamily: "Inter, ui-sans-serif, system-ui",
  darkModeDefault: false,
  logoPublicId: undefined,
  faviconPublicId: undefined,
  social: {
    twitter: undefined,
    linkedin: undefined,
    facebook: undefined,
  },
};

let currentTheme: ThemeSettings = { ...DEFAULT_THEME };

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function fetchTheme(): Promise<ThemeSettings> {
  await delay();
  return { ...currentTheme };
}

export async function updateTheme(input: ThemeInput): Promise<ThemeSettings> {
  await delay();
  const parsed = themeSchema.parse(input);
  currentTheme = { ...currentTheme, ...parsed };
  return { ...currentTheme };
}

export async function resetTheme(): Promise<ThemeSettings> {
  await delay();
  currentTheme = { ...DEFAULT_THEME };
  return { ...currentTheme };
}
