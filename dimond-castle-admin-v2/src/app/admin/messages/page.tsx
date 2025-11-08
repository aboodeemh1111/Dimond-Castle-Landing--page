'use client'

import { MessagesTable } from '@/components/contact/MessagesTable'
import { useAdminI18n } from '@/components/providers/AdminI18nProvider'
import { Mail } from 'lucide-react'

export default function MessagesPage() {
  const { t } = useAdminI18n()

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <Mail className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{t('messages.title')}</h1>
            <p className="text-muted-foreground">{t('messages.subtitle')}</p>
          </div>
        </div>
      </div>

      <MessagesTable />
    </div>
  )
}
