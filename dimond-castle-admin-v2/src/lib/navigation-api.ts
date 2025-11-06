import { api } from './api'

export type NavItem = {
  id: string
  labelEN: string
  labelAR: string
  href: string
  type: 'internal' | 'external'
  visible?: boolean
  newTab?: boolean
  children?: NavItem[]
}

export type NavigationDoc = {
  _id: string
  name: string
  items: NavItem[]
  updatedAt: string
  createdAt: string
}

export async function getNavigation(name: string): Promise<NavigationDoc | null> {
  try {
    return await api.get(`/api/navigation/${encodeURIComponent(name)}`)
  } catch {
    return null
  }
}

export async function saveNavigation(name: string, items: NavItem[]): Promise<NavigationDoc> {
  return await api.put(`/api/navigation/${encodeURIComponent(name)}`, { items })
}


