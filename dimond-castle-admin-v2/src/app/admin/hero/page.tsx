'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { HeroSettingsForm } from '@/components/hero/HeroSettingsForm'
import { getHeroSettings, saveHeroSettings, type HeroSettings } from '@/lib/hero-api'

export default function HeroSettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<HeroSettings | null>(null)

  const query = useQuery({
    queryKey: ['hero-settings'],
    queryFn: getHeroSettings,
  })

  useEffect(() => {
    if (query.data) setSettings(query.data)
  }, [query.data])

  const saveMutation = useMutation({
    mutationFn: async (payload: HeroSettings) => saveHeroSettings(payload),
    onSuccess: (data) => {
      setSettings(data)
      toast({ title: 'Hero settings saved' })
    },
    onError: (error: Error) => toast({ title: 'Save failed', description: error.message, variant: 'destructive' }),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hero</h1>
          <p className="text-muted-foreground">Control the homepage hero content and visuals.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => query.refetch()} disabled={query.isFetching}>
            Reset to latest
          </Button>
          <Button onClick={() => settings && saveMutation.mutate(settings)} disabled={!settings || saveMutation.isPending}>
            Save Changes
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero content</CardTitle>
        </CardHeader>
        <CardContent>
          <HeroSettingsForm value={settings} onChange={setSettings} />
        </CardContent>
      </Card>
    </div>
  )
}


