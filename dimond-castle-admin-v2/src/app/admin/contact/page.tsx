'use client'

import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { ContactInfoForm } from '@/components/contact/ContactInfoForm'
import { MessagesTable } from '@/components/contact/MessagesTable'
import { getContactSettings, saveContactSettings, type ContactSettings } from '@/lib/contact-api'

export default function ContactAdminPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<ContactSettings | null>(null)
  const [activeTab, setActiveTab] = useState('info')

  const settingsQuery = useQuery({
    queryKey: ['contact-settings'],
    queryFn: getContactSettings,
  })

  useEffect(() => {
    if (settingsQuery.data) setSettings(settingsQuery.data)
  }, [settingsQuery.data])

  const saveMutation = useMutation({
    mutationFn: async (payload: ContactSettings) => {
      if (!payload.titleEN?.trim() || !payload.titleAR?.trim()) {
        throw new Error('Both EN and AR titles are required')
      }
      return saveContactSettings(payload)
    },
    onSuccess: () => toast({ title: 'Contact settings saved' }),
    onError: (e: Error) => toast({ title: 'Save failed', description: e.message, variant: 'destructive' }),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contact</h1>
          <p className="text-muted-foreground">Manage contact information and view messages</p>
        </div>
        {activeTab === 'info' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => settingsQuery.refetch()}
              disabled={settingsQuery.isFetching}
            >
              Reset to default
            </Button>
            <Button
              onClick={() => settings && saveMutation.mutate(settings)}
              disabled={!settings || saveMutation.isPending}
            >
              Save Changes
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


