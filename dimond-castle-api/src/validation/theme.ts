import { z } from 'zod'

// HEX color validation
const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid HEX color (e.g., #2C5E47)')

// Safe font lists
const safeENFonts = ['Inter', 'Work Sans', 'Montserrat', 'Roboto', 'Open Sans', 'Lato'] as const
const safeARFonts = ['Tajawal', 'Cairo', 'IBM Plex Arabic', 'Almarai', 'Noto Sans Arabic'] as const

export const ThemeSchema = z.object({
  brand: z.object({
    primaryColor: hexColorSchema,
    secondaryColor: hexColorSchema,
    accentColor: hexColorSchema,
    backgroundColor: hexColorSchema,
    surfaceColor: hexColorSchema,
  }),
  typography: z.object({
    fontFamilyEN: z.enum(safeENFonts),
    fontFamilyAR: z.enum(safeARFonts),
    baseFontSize: z.number().int().min(14).max(18),
    headingWeight: z.number().int().min(500).max(900).multipleOf(100),
    bodyWeight: z.number().int().min(300).max(700).multipleOf(100),
  }),
  globalAssets: z.object({
    logoLightId: z.string().optional(),
    logoDarkId: z.string().optional(),
    faviconId: z.string().optional(),
    socialPreviewId: z.string().optional(),
  }),
  designTokens: z.object({
    borderRadius: z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
    spacingScale: z.enum(['tight', 'normal', 'spacious']),
    shadowLevel: z.enum(['none', 'soft', 'base', 'strong']),
  }),
  updatedBy: z.string().optional(),
})

export const ThemeUpdateSchema = ThemeSchema.partial()

export type ThemeInput = z.infer<typeof ThemeSchema>
export type ThemeUpdate = z.infer<typeof ThemeUpdateSchema>

// Default theme values
export const DEFAULT_THEME: ThemeInput = {
  brand: {
    primaryColor: '#2C5E47',
    secondaryColor: '#1a3a2e',
    accentColor: '#D4AF37',
    backgroundColor: '#FFFFFF',
    surfaceColor: '#F9FAFB',
  },
  typography: {
    fontFamilyEN: 'Inter',
    fontFamilyAR: 'Tajawal',
    baseFontSize: 16,
    headingWeight: 700,
    bodyWeight: 400,
  },
  globalAssets: {},
  designTokens: {
    borderRadius: 'lg',
    spacingScale: 'normal',
    shadowLevel: 'base',
  },
}

