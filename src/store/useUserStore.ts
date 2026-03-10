import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

interface UserStore {
    profile: UserProfile
    updateProfile: (updates: Partial<UserProfile>) => void
    updatePreferences: (preferences: Partial<UserPreferences>) => void
    completeOnboarding: () => void
}

const defaultProfile: UserProfile = {
    name: '',
    email: '',
    preferences: {
        roles: [],
        industries: [],
        locations: [],
    },
    hasCompletedOnboarding: false,
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            profile: defaultProfile,
            updateProfile: (updates) =>
                set((state) => ({
                    profile: { ...state.profile, ...updates },
                })),
            updatePreferences: (preferences) =>
                set((state) => ({
                    profile: {
                        ...state.profile,
                        preferences: { ...state.profile.preferences, ...preferences },
                    },
                })),
            completeOnboarding: () =>
                set((state) => ({
                    profile: { ...state.profile, hasCompletedOnboarding: true },
                })),
        }),
        {
            name: 'career-compass-user',
        }
    )
)
