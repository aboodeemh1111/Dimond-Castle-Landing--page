'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchTheme, updateTheme, resetTheme, type Theme, type ThemeUpdate } from '@/lib/theme-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { Save, RotateCcw } from 'lucide-react'
import { BrandColorsSection } from '@/components/theme/BrandColorsSection'
import { TypographySection } from '@/components/theme/TypographySection'
import { GlobalAssetsSection } from '@/components/theme/GlobalAssetsSection'
import { DesignTokensSection } from '@/components/theme/DesignTokensSection'
import { ThemePreview } from '@/components/theme/ThemePreview'

export default function ThemePage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [localTheme, setLocalTheme] = useState<Theme | null>(null)

  const { data: theme, isLoading, error } = useQuery({
    queryKey: ['theme'],
    queryFn: async () => {
      console.log('Fetching theme from API...')
      try {
        const result = await fetchTheme()
        console.log('Theme fetched successfully:', result)
        return result
      } catch (err) {
        console.error('Failed to fetch theme:', err)
        throw err
      }
    },
  })

  // Update localTheme when theme data changes
  if (theme && !localTheme) {
    setLocalTheme(theme)
  }

  const updateMutation = useMutation({
    mutationFn: updateTheme,
    onSuccess: (updated) => {
      queryClient.setQueryData(['theme'], updated)
      setLocalTheme(updated)
      toast({ title: 'Theme saved successfully' })
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to save theme', description: error.message, variant: 'destructive' })
    },
  })

  const resetMutation = useMutation({
    mutationFn: resetTheme,
    onSuccess: (reset) => {
      queryClient.setQueryData(['theme'], reset)
      setLocalTheme(reset)
      toast({ title: 'Theme reset to defaults' })
      setResetDialogOpen(false)
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to reset theme', description: error.message, variant: 'destructive' })
    },
  })

  const handleSave = () => {
    if (!localTheme) return
    const { _id, createdAt, updatedAt, ...updates } = localTheme
    updateMutation.mutate(updates)
  }

  const updateLocal = (updates: ThemeUpdate) => {
    if (!localTheme) return
    setLocalTheme({ ...localTheme, ...updates } as Theme)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-muted-foreground">Loading theme...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
        <div className="text-destructive">Failed to load theme</div>
        <div className="text-sm text-muted-foreground">{(error as Error).message}</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  if (!localTheme) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-muted-foreground">Initializing theme...</div>
      </div>
    )
  }

  const hasChanges = JSON.stringify(theme) !== JSON.stringify(localTheme)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Theme</h1>
          <p className="text-muted-foreground">Manage brand identity and global website styling</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setResetDialogOpen(true)}
            disabled={updateMutation.isPending || resetMutation.isPending}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Default
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateMutation.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Settings */}
        <div className="lg:col-span-2 space-y-6">
          <BrandColorsSection
            colors={localTheme.brand}
            onChange={(brand) => updateLocal({ brand })}
          />

          <TypographySection
            typography={localTheme.typography}
            onChange={(typography) => updateLocal({ typography })}
          />

          <GlobalAssetsSection
            assets={localTheme.globalAssets}
            onChange={(globalAssets) => updateLocal({ globalAssets })}
          />

          <DesignTokensSection
            tokens={localTheme.designTokens}
            onChange={(designTokens) => updateLocal({ designTokens })}
          />
        </div>

        {/* Right Column - Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <ThemePreview theme={localTheme} />
          </div>
        </div>
      </div>

      {/* Reset Dialog */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Theme to Defaults</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset the theme to system defaults? This will discard all your customizations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => resetMutation.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

