'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { StorySettingsForm } from '@/components/story/StorySettingsForm'
import { getStorySettings, saveStorySettings, type StorySettings } from '@/lib/story-api'

export default function StorySettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<StorySettings | null>(null)

  const query = useQuery({
    queryKey: ['story-settings'],
    queryFn: getStorySettings,
  })

  useEffect(() => {
    if (query.data) setSettings(query.data)
  }, [query.data])

  const saveMutation = useMutation({
    mutationFn: async (payload: StorySettings) => saveStorySettings(payload),
    onSuccess: (data) => {
      setSettings(data)
      toast({ title: 'Story settings saved' })
    },
    onError: (error: Error) => toast({ title: 'Save failed', description: error.message, variant: 'destructive' }),
  })

  if (query.isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-muted-foreground">
        Loading story settings...
      </div>
    )
  }

  if (query.isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
        <div className="text-destructive">Failed to load story settings</div>
        <Button onClick={() => query.refetch()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Story</h1>
          <p className="text-muted-foreground">Manage the Introduction & Story section on the website.</p>
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
          <CardTitle>Story content</CardTitle>
        </CardHeader>
        <CardContent>
          <StorySettingsForm value={settings} onChange={setSettings} />
        </CardContent>
      </Card>
    </div>
  )
}


