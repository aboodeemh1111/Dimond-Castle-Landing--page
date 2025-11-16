'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { ValuesSettingsForm } from '@/components/values/ValuesSettingsForm'
import { getValuesSettings, saveValuesSettings, type ValuesSettings } from '@/lib/values-api'

export default function ValuesSettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<ValuesSettings | null>(null)

  const query = useQuery({
    queryKey: ['values-settings'],
    queryFn: getValuesSettings,
  })

  useEffect(() => {
    if (query.data) setSettings(query.data)
  }, [query.data])

  const saveMutation = useMutation({
    mutationFn: async (payload: ValuesSettings) => saveValuesSettings(payload),
    onSuccess: (data) => {
      setSettings(data)
      toast({ title: 'Values section saved' })
    },
    onError: (error: Error) => toast({ title: 'Save failed', description: error.message, variant: 'destructive' }),
  })

  if (query.isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-muted-foreground">
        Loading values settings...
      </div>
    )
  }

  if (query.isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
        <div className="text-destructive">Failed to load values settings</div>
        <Button onClick={() => query.refetch()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Values</h1>
          <p className="text-muted-foreground">Control the corporate values cards on the public site.</p>
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
          <CardTitle>Values content</CardTitle>
        </CardHeader>
        <CardContent>
          <ValuesSettingsForm value={settings} onChange={setSettings} />
        </CardContent>
      </Card>
    </div>
  )
}


