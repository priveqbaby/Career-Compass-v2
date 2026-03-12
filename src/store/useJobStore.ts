import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

export type JobStatus = 'Saved' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected'

export interface JobApplication {
  id: string
  company: string
  role: string
  location: string
  salary: string
  status: JobStatus
  date: string
  time?: string
  source: string
  logo?: string
}

interface JobStore {
  applications: JobApplication[]
  isLoading: boolean
  addApplication: (job: Omit<JobApplication, 'id'>) => Promise<void>
  updateApplicationStatus: (id: string, status: JobStatus) => Promise<void>
  updateApplication: (id: string, updates: Partial<JobApplication>) => Promise<void>
  deleteApplication: (id: string) => Promise<void>
  moveApplication: (id: string, status: JobStatus) => Promise<void>
  loadFromSupabase: (userId: string) => Promise<void>
  reset: () => void
}

export const useJobStore = create<JobStore>()((set, get) => ({
  applications: [],
  isLoading: false,

  loadFromSupabase: async (userId) => {
    set({ isLoading: true })
    const { data } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (data) {
      set({
        applications: data.map((row) => ({
          id: row.id,
          company: row.company,
          role: row.role,
          location: row.location ?? '',
          salary: row.salary ?? '',
          status: row.status as JobStatus,
          date: row.date,
          time: row.time ?? undefined,
          source: row.source ?? '',
          logo: row.logo ?? undefined,
        })),
      })
    }
    set({ isLoading: false })
  },

  addApplication: async (job) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    // Optimistic local update with temp id
    const tempId = `temp-${Date.now()}`
    set((state) => ({
      applications: [{ ...job, id: tempId }, ...state.applications],
    }))

    const { data, error } = await supabase
      .from('job_applications')
      .insert({ ...job, user_id: session.user.id })
      .select()
      .single()

    if (error || !data) {
      // Revert on failure
      set((state) => ({
        applications: state.applications.filter((a) => a.id !== tempId),
      }))
      return
    }

    // Replace temp with DB record
    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === tempId ? { ...a, id: data.id } : a
      ),
    }))
  },

  updateApplicationStatus: async (id, status) => {
    set((state) => ({
      applications: state.applications.map((a) => (a.id === id ? { ...a, status } : a)),
    }))
    await supabase.from('job_applications').update({ status }).eq('id', id)
  },

  updateApplication: async (id, updates) => {
    set((state) => ({
      applications: state.applications.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }))
    await supabase.from('job_applications').update(updates).eq('id', id)
  },

  deleteApplication: async (id) => {
    const previous = get().applications
    set((state) => ({
      applications: state.applications.filter((a) => a.id !== id),
    }))
    const { error } = await supabase.from('job_applications').delete().eq('id', id)
    if (error) set({ applications: previous })
  },

  moveApplication: async (id, status) => {
    set((state) => ({
      applications: state.applications.map((a) => (a.id === id ? { ...a, status } : a)),
    }))
    await supabase.from('job_applications').update({ status }).eq('id', id)
  },

  reset: () => set({ applications: [], isLoading: false }),
}))
