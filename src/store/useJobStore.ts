import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

export type JobStatus = 'Saved' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected'

export interface JobApplication {
    id: string
    company: string
    role: string
    location: string
    salary: string
    status: JobStatus
    date: string // ISO date string
    time?: string // HH:mm format
    source: string
    logo?: string // URL or placeholder
}

interface JobStore {
    applications: JobApplication[]
    addApplication: (job: Omit<JobApplication, 'id'>) => void
    updateApplicationStatus: (id: string, status: JobStatus) => void
    updateApplication: (id: string, updates: Partial<JobApplication>) => void
    deleteApplication: (id: string) => void
    moveApplication: (id: string, status: JobStatus) => void
}

// Mock data
const initialApplications: JobApplication[] = [
    {
        id: '1',
        company: 'Netflix',
        role: 'Product Manager',
        location: 'Los Gatos, CA',
        salary: '$150,000 - $190,000',
        status: 'Applied',
        date: '2025-11-22',
        time: '14:00',
        source: 'Referral',
    },
    {
        id: '2',
        company: 'Google',
        role: 'Senior Software Engineer',
        location: 'Mountain View, CA',
        salary: '$180,000 - $220,000',
        status: 'Interviewing',
        date: '2025-11-22',
        time: '10:30',
        source: 'LinkedIn',
    },
    {
        id: '3',
        company: 'Amazon',
        role: 'Frontend Developer',
        location: 'Seattle, WA',
        salary: '$130,000 - $160,000',
        status: 'Offer',
        date: '2025-11-22',
        time: '09:00',
        source: 'Company Website',
    },
    {
        id: '4',
        company: 'Meta',
        role: 'Data Scientist',
        location: 'Menlo Park, CA',
        salary: '$140,000 - $180,000',
        status: 'Rejected',
        date: '2025-11-22',
        source: 'Indeed',
    },
    {
        id: '5',
        company: 'Stripe',
        role: 'Full Stack Engineer',
        location: 'San Francisco, CA',
        salary: '$170,000 - $200,000',
        status: 'Saved',
        date: '2025-11-22',
        source: 'LinkedIn',
    },
]

export const useJobStore = create<JobStore>()(
    persist(
        (set) => ({
            applications: initialApplications,
            addApplication: (job) =>
                set((state) => ({
                    applications: [...state.applications, { ...job, id: uuidv4() }],
                })),
            updateApplicationStatus: (id, status) =>
                set((state) => ({
                    applications: state.applications.map((app) =>
                        app.id === id ? { ...app, status } : app
                    ),
                })),
            updateApplication: (id, updates) =>
                set((state) => ({
                    applications: state.applications.map((app) =>
                        app.id === id ? { ...app, ...updates } : app
                    ),
                })),
            deleteApplication: (id) =>
                set((state) => ({
                    applications: state.applications.filter((app) => app.id !== id),
                })),
            moveApplication: (id, status) =>
                set((state) => ({
                    applications: state.applications.map((app) =>
                        app.id === id ? { ...app, status } : app
                    ),
                })),
        }),
        {
            name: 'career-compass-storage',
        }
    )
)
