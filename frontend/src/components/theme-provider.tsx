'use client'

import * as React from 'react'

type Theme = 'light' | 'dark' | 'system'

type ThemeContextValue = {
  themes: Theme[]
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  systemTheme: 'light' | 'dark'
  setTheme: React.Dispatch<React.SetStateAction<string>>
}

type ThemeProviderProps = React.PropsWithChildren<{
  defaultTheme?: Theme
  storageKey?: string
}>

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
)

function getSystemTheme() {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function getStoredTheme(storageKey: string, defaultTheme: Theme) {
  if (typeof window === 'undefined') {
    return defaultTheme
  }

  const storedTheme = window.localStorage.getItem(storageKey)
  return storedTheme === 'light' ||
    storedTheme === 'dark' ||
    storedTheme === 'system'
    ? storedTheme
    : defaultTheme
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme'
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() =>
    getStoredTheme(storageKey, defaultTheme)
  )
  const [systemTheme, setSystemTheme] = React.useState<'light' | 'dark'>(() =>
    getSystemTheme()
  )

  const resolvedTheme = theme === 'system' ? systemTheme : theme

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => setSystemTheme(getSystemTheme())

    handleChange()
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  React.useEffect(() => {
    const root = document.documentElement

    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)
    root.style.colorScheme = resolvedTheme
    window.localStorage.setItem(storageKey, theme)
  }, [resolvedTheme, storageKey, theme])

  const setTheme = React.useCallback<
    React.Dispatch<React.SetStateAction<string>>
  >((value) => {
    setThemeState((currentTheme) => {
      const nextTheme =
        typeof value === 'function' ? value(currentTheme) : value

      return nextTheme === 'light' ||
        nextTheme === 'dark' ||
        nextTheme === 'system'
        ? nextTheme
        : currentTheme
    })
  }, [])

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      themes: ['light', 'dark', 'system'],
      theme,
      resolvedTheme,
      systemTheme,
      setTheme
    }),
    [resolvedTheme, setTheme, systemTheme, theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider.')
  }

  return context
}
