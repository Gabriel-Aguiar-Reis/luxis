import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export enum Theme {
  'light',
  'dark',
  'system'
}

export type AppearanceSettings = {
  theme: Theme
}

type SettingsState = {
  appearance: AppearanceSettings
  isLoading: boolean
  error: string | null
  updateAppearance: (settings: Partial<AppearanceSettings>) => Promise<void>
  resetSettings: () => void
}

const DEFAULT_APPEARANCE: AppearanceSettings = {
  theme: Theme.system
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === Theme.system) {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? Theme.dark
      : Theme.light
    root.classList.toggle('dark', systemTheme === Theme.dark)
  } else {
    root.classList.toggle('dark', theme === Theme.dark)
  }
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      appearance: { ...DEFAULT_APPEARANCE },
      isLoading: false,
      error: null,

      updateAppearance: async (settings) => {
        set({ isLoading: true, error: null })
        const updatedAppearance = { ...get().appearance, ...settings }
        set({ appearance: updatedAppearance, isLoading: false })
        if (settings.theme) applyTheme(settings.theme)
      },

      resetSettings: () => {
        set({ appearance: { ...DEFAULT_APPEARANCE } })
      }
    }),
    { name: 'user-settings' }
  )
)
