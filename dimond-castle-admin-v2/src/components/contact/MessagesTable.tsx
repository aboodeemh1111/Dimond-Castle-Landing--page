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

export function MessagesTable() {
  const qc = useQueryClient()
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Input placeholder="Search name/email/phone/message" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} />
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v as any); setPage(1) }}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unseen">Unseen</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="unresolved">Unresolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((m) => (
              <TableRow key={m._id}>
                <TableCell>{m.name || '-'}</TableCell>
                <TableCell>{m.email || m.phone || '-'}</TableCell>
                <TableCell className="max-w-[280px] truncate">{m.message}</TableCell>
                <TableCell>{new Date(m.submittedAt).toLocaleString()}</TableCell>
                <TableCell className="space-x-2">
                  <Badge variant={m.seen ? 'secondary' : 'default'}>{m.seen ? 'Seen' : 'Unseen'}</Badge>
                  <Badge variant={m.resolved ? 'secondary' : 'outline'}>{m.resolved ? 'Resolved' : 'Unresolved'}</Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => setView(m)}>View</Button>
                  <Button size="sm" variant="outline" onClick={() => toggleSeen.mutate(m)}>{m.seen ? 'Mark Unseen' : 'Mark Seen'}</Button>
                  <Button size="sm" variant="outline" onClick={() => toggleResolved.mutate(m)}>{m.resolved ? 'Mark Unresolved' : 'Mark Resolved'}</Button>
                  <Button size="sm" variant="destructive" onClick={() => del.mutate(m)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between text-sm">
          <div>
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </div>
          <div className="space-x-2">
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
            <Button variant="outline" disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message</DialogTitle>
          </DialogHeader>
          {view && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Name" value={view.name || '-'} />
                <Field label="Contact" value={view.email || view.phone || '-'} />
              </div>
              <Field label="Date" value={new Date(view.submittedAt).toLocaleString()} />
              <div>
                <div className="text-sm font-medium mb-1">Message</div>
                <div className="rounded-md border p-3 text-sm whitespace-pre-wrap">{view.message}</div>
              </div>
              <Separator />
              <div className="flex justify-between">
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => toggleSeen.mutate(view)}>{view.seen ? 'Mark Unseen' : 'Mark Seen'}</Button>
                  <Button variant="outline" onClick={() => toggleResolved.mutate(view)}>{view.resolved ? 'Mark Unresolved' : 'Mark Resolved'}</Button>
                </div>
                <Button variant="destructive" onClick={() => del.mutate(view)}>Delete</Button>
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


