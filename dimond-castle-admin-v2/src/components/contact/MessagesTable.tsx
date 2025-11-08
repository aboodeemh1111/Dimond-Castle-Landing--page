"use client"

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listMessages, updateMessage, deleteMessage, type ContactMessage } from '@/lib/contact-api'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, CheckCircle, Circle, MoreHorizontal, Search, Filter, Mail, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAdminI18n } from '@/components/providers/AdminI18nProvider'

export function MessagesTable() {
  const qc = useQueryClient()
  const { t, locale } = useAdminI18n()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'all' | 'unseen' | 'resolved' | 'unresolved'>('all')
  const [page, setPage] = useState(1)
  const [view, setView] = useState<ContactMessage | null>(null)

  const query = useQuery({
    queryKey: ['contact-messages', { q, status, page }],
    queryFn: () => listMessages({ q, status, page, limit: 20 }),
  })

  const toggleSeen = useMutation({
    mutationFn: (m: ContactMessage) => updateMessage(m._id, { seen: !m.seen }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contact-messages'] }),
  })
  const toggleResolved = useMutation({
    mutationFn: (m: ContactMessage) => updateMessage(m._id, { resolved: !m.resolved }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contact-messages'] }),
  })
  const del = useMutation({
    mutationFn: (m: ContactMessage) => deleteMessage(m._id),
    onSuccess: () => {
      setView(null)
      qc.invalidateQueries({ queryKey: ['contact-messages'] })
    },
  })

  const items = query.data?.items || []
  const pagination = query.data?.pagination

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t('actions.filter')} & {t('actions.search')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('messages.search')}
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1) }}
                className="pl-10"
              />
            </div>
            <Select value={status} onValueChange={(v) => { setStatus(v as any); setPage(1) }}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder={t('actions.filter')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('messages.allMessages')}</SelectItem>
                <SelectItem value="unseen">{t('messages.unseen')}</SelectItem>
                <SelectItem value="resolved">{t('messages.resolved')}</SelectItem>
                <SelectItem value="unresolved">{t('messages.unresolved')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card>
        <CardContent className="p-0">
          {query.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">{t('messages.noMessages')}</h3>
              <p className="text-sm text-muted-foreground">{t('messages.noMessagesDesc')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Name</TableHead>
                    <TableHead className="w-[200px]">Contact</TableHead>
                    <TableHead className="min-w-[200px]">Message</TableHead>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead className="w-[150px]">Status</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((m) => (
                    <TableRow key={m._id}>
                      <TableCell className="font-medium">{m.name || '-'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{m.email || m.phone || '-'}</TableCell>
                      <TableCell className="max-w-[300px]">
                        <div className="truncate text-sm" title={m.message}>{m.message}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(m.submittedAt).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant={m.seen ? 'secondary' : 'default'} className="text-xs">
                            {m.seen ? 'Seen' : 'Unseen'}
                          </Badge>
                          <Badge variant={m.resolved ? 'secondary' : 'outline'} className="text-xs">
                            {m.resolved ? 'Resolved' : 'Unresolved'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => setView(m)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => toggleSeen.mutate(m)}>
                            {m.seen ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => toggleResolved.mutate(m)}>
                            {m.resolved ? <Circle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => del.mutate(m)} className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {/* Mobile Actions */}
                        <div className="md:hidden">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setView(m)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleSeen.mutate(m)}>
                                {m.seen ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                                {m.seen ? 'Mark Unseen' : 'Mark Seen'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleResolved.mutate(m)}>
                                {m.resolved ? <Circle className="h-4 w-4 mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                                {m.resolved ? 'Mark Unresolved' : 'Mark Resolved'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => del.mutate(m)} className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.pages} ({pagination.total} total messages)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message Detail Dialog */}
      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Message Details
            </DialogTitle>
          </DialogHeader>
          {view && (
            <div className="space-y-6">
              {/* Status Badges */}
              <div className="flex gap-2">
                <Badge variant={view.seen ? 'secondary' : 'default'}>
                  {view.seen ? 'Seen' : 'Unseen'}
                </Badge>
                <Badge variant={view.resolved ? 'secondary' : 'outline'}>
                  {view.resolved ? 'Resolved' : 'Unresolved'}
                </Badge>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Name" value={view.name || '-'} />
                <Field label="Contact" value={view.email || view.phone || '-'} />
                <Field label="Email" value={view.email || '-'} />
                <Field label="Phone" value={view.phone || '-'} />
              </div>

              {/* Date */}
              <Field label="Submitted" value={
                new Date(view.submittedAt).toLocaleString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              } />

              {/* Message Content */}
              <div>
                <div className="text-sm font-medium mb-2">Message</div>
                <div className="rounded-md border bg-muted/50 p-4 text-sm whitespace-pre-wrap leading-relaxed">
                  {view.message}
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSeen.mutate(view)}
                    className="flex items-center gap-2"
                  >
                    {view.seen ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {view.seen ? 'Mark Unseen' : 'Mark Seen'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleResolved.mutate(view)}
                    className="flex items-center gap-2"
                  >
                    {view.resolved ? <Circle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    {view.resolved ? 'Mark Unresolved' : 'Mark Resolved'}
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => del.mutate(view)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  )
}


