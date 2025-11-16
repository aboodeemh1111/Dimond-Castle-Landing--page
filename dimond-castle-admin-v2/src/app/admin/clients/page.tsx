'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { ClientsForm } from '@/components/clients/ClientsForm'
import { getClientSettings, saveClientSettings, type ClientSettings } from '@/lib/clients-api'

export default function ClientsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<ClientSettings | null>(null)

  const settingsQuery = useQuery({
    queryKey: ['clients-settings'],
    queryFn: getClientSettings,
  })

  useEffect(() => {
    if (settingsQuery.data) setSettings(settingsQuery.data)
  }, [settingsQuery.data])

  const saveMutation = useMutation({
    mutationFn: async (payload: ClientSettings) => saveClientSettings(payload),
    onSuccess: (data) => {
      setSettings(data)
      toast({ title: 'Client section updated' })
    },
    onError: (error: Error) =>
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' }),
  })

  if (settingsQuery.isLoading || !settings) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-muted-foreground">
        Loading client settings...
      </div>
    )
  }

  if (settingsQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
        <div className="text-destructive">Failed to load client settings.</div>
        <div className="text-sm text-muted-foreground">
          {(settingsQuery.error as Error)?.message ?? 'Unexpected error'}
        </div>
        <Button onClick={() => settingsQuery.refetch()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground">Manage the client logos shown on the public website.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => settingsQuery.refetch()} disabled={settingsQuery.isFetching}>
            Reset to latest
          </Button>
          <Button onClick={() => settings && saveMutation.mutate(settings)} disabled={!settings || saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clients section</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientsForm value={settings} onChange={setSettings} />
        </CardContent>
      </Card>
    </div>
  )
}

