'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { VisionSettingsForm } from '@/components/vision/VisionSettingsForm'
import { getVisionSettings, saveVisionSettings, type VisionSettings } from '@/lib/vision-api'

export default function VisionSettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<VisionSettings | null>(null)

  const query = useQuery({
    queryKey: ['vision-settings'],
    queryFn: getVisionSettings,
  })

  useEffect(() => {
    if (query.data) setSettings(query.data)
  }, [query.data])

  const saveMutation = useMutation({
    mutationFn: async (payload: VisionSettings) => saveVisionSettings(payload),
    onSuccess: (data) => {
      setSettings(data)
      toast({ title: 'Vision section saved' })
    },
    onError: (error: Error) => toast({ title: 'Save failed', description: error.message, variant: 'destructive' }),
  })

  if (query.isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-muted-foreground">
        Loading vision settings...
      </div>
    )
  }

  if (query.isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
        <div className="text-destructive">Failed to load vision settings</div>
        <Button onClick={() => query.refetch()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vision & Mission</h1>
          <p className="text-muted-foreground">Control the vision section on the public site.</p>
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
          <CardTitle>Vision content</CardTitle>
        </CardHeader>
        <CardContent>
          <VisionSettingsForm value={settings} onChange={setSettings} />
        </CardContent>
      </Card>
    </div>
  )
}


