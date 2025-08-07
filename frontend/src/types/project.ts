export interface Contact {
  name: string
  phone: string
}

export interface Project {
  id: number
  name: string
  managers: Contact[]
  upstreamContacts: Contact[]
  downstreamContacts: Contact[]
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
}