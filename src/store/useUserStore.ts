import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

export interface UserPreferences {
  roles: string[]
  industries: string[]
  locations: string[]
}

export interface UserProfile {
  name: string
  email: string
  cvFileName?: string
  preferences: UserPreferences
  hasCompletedOnboarding: boolean
}

const defaultProfile: UserProfile = {
  name: '',
  email: '',
  preferences: { roles: [], industries: [], locations: [] },
  hasCompletedOnboarding: false,
}

interface UserStore {
  profile: UserProfile
  updateProfile: (updates: Partial<UserProfile>) => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  completeOnboarding: () => void
  loadFromSupabase: (userId: string, email?: string) => Promise<void>
  syncToSupabase: () => Promise<void>
  reset: () => void
}

export const useUserStore = create<UserStore>()((set, get) => ({
  profile: defaultProfile,

  updateProfile: (updates) => {
    set((state) => ({ profile: { ...state.profile, ...updates } }))
    get().syncToSupabase()
  },

  updatePreferences: (preferences) => {
    set((state) => ({
      profile: {
        ...state.profile,
        preferences: { ...state.profile.preferences, ...preferences },
      },
    }))
    get().syncToSupabase()
  },

  completeOnboarding: () => {
    set((state) => ({ profile: { ...state.profile, hasCompletedOnboarding: true } }))
    get().syncToSupabase()
  },

  loadFromSupabase: async (userId, email = '') => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data) {
      set({
        profile: {
          name: data.name ?? '',
          email,
          cvFileName: data.cv_file_name ?? undefined,
          preferences: {
            roles: data.preferred_roles ?? [],
            industries: data.preferred_industries ?? [],
            locations: data.preferred_locations ?? [],
          },
          hasCompletedOnboarding: data.has_completed_onboarding ?? false,
        },
      })
    }
  },

  syncToSupabase: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { profile } = get()
    await supabase.from('profiles').upsert({
      id: session.user.id,
      name: profile.name,
      cv_file_name: profile.cvFileName ?? null,
      preferred_roles: profile.preferences.roles,
      preferred_industries: profile.preferences.industries,
      preferred_locations: profile.preferences.locations,
      has_completed_onboarding: profile.hasCompletedOnboarding,
    })
  },

  reset: () => set({ profile: defaultProfile }),
}))
