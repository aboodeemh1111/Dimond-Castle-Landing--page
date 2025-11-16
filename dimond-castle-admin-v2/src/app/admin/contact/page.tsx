'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { ContactInfoForm } from '@/components/contact/ContactInfoForm'
import { MessagesTable } from '@/components/contact/MessagesTable'
import { getContactSettings, saveContactSettings, type ContactSettings } from '@/lib/contact-api'

export default function ContactAdminPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [settings, setSettings] = useState<ContactSettings | null>(null)
  const [activeTab, setActiveTab] = useState('info')
  const [originalSettings, setOriginalSettings] = useState<ContactSettings | null>(null)

  const settingsQuery = useQuery({
    queryKey: ['contact-settings'],
    queryFn: getContactSettings,
  })

  useEffect(() => {
    if (settingsQuery.data) {
      setSettings(settingsQuery.data)
      setOriginalSettings(settingsQuery.data)
    }
  }, [settingsQuery.data])

  const saveMutation = useMutation({
    mutationFn: async (payload: ContactSettings) => {
      if (!payload.titleEN?.trim() || !payload.titleAR?.trim()) {
        throw new Error('Both EN and AR titles are required')
      }
      return saveContactSettings(payload)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['contact-settings'], data)
      setOriginalSettings(data)
      toast({ title: 'Contact settings saved' })
    },
    onError: (e: Error) => {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' })
    },
  })

  const handleReset = () => {
    if (originalSettings) {
      setSettings(originalSettings)
      toast({ title: 'Reset to last saved state' })
    } else if (settingsQuery.data) {
      setSettings(settingsQuery.data)
      setOriginalSettings(settingsQuery.data)
      toast({ title: 'Reset to latest' })
    }
  }

  if (settingsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-muted-foreground">Loading contact settings...</div>
      </div>
    )
  }

  if (settingsQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
        <div className="text-destructive">Failed to load contact settings</div>
        <div className="text-sm text-muted-foreground">{(settingsQuery.error as Error).message}</div>
        <Button onClick={() => settingsQuery.refetch()}>Retry</Button>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-muted-foreground">Initializing contact settings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contact</h1>
          <p className="text-muted-foreground">Manage contact information and view messages</p>
        </div>
        {activeTab === 'info' && (
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={settingsQuery.isFetching || !originalSettings}
            >
              Reset to default
            </Button>
            <Button
              onClick={() => settings && saveMutation.mutate(settings)}
              disabled={!settings || saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="info">Contact Info</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactInfoForm value={settings} onChange={setSettings} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <MessagesTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}


