/**
 * useTheme.js — src/renderer/hooks/useTheme.js
 * Manages the active UI theme (dark/light) for the Simplex AI renderer.
 * Reads initial value from saved config, applies it to <html data-theme>,
 * and notifies the parent when the user toggles it.
 *
 * WHAT:  Applies `data-theme` attribute to the HTML root element and exposes
 *        a `toggleTheme` function.
 * WHY:   CSS custom-property scoping on [data-theme] lets the entire token
 *        system flip with a single attribute change — no class juggling.
 * HOW:   Accepts `initialTheme` (from config) and `onThemeChange` (saves back
 *        to config). Falls back to OS preference when no saved value exists.
 */
import React from 'react'

/**
 * WHAT:  Hook that owns theme state and syncs it to the DOM.
 * PARAMS:
 *   initialTheme: string|undefined — 'dark' | 'light' from saved config
 *   onThemeChange: (theme: string) => void — called when user toggles
 * RETURNS: { theme: string, toggleTheme: () => void }
 */
export function useTheme(initialTheme, onThemeChange) {
  const [theme, setTheme] = React.useState(() => {
    // Priority: saved config → OS preference → dark
    if (initialTheme === 'light' || initialTheme === 'dark') return initialTheme
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  // Sync saved config value once it loads from IPC (async)
  React.useEffect(() => {
    if (initialTheme === 'light' || initialTheme === 'dark') {
      setTheme(initialTheme)
    }
  }, [initialTheme])

  // Apply to DOM whenever theme changes
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    onThemeChange?.(next)
  }

  return { theme, toggleTheme }
}
