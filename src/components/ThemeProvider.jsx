"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"
type ColorScheme = "pink" | "purple" | "blue" | "mint"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultColorScheme?: ColorScheme
}

type ThemeProviderState = {
  theme: Theme
  colorScheme: ColorScheme
  setTheme: (theme: Theme) => void
  setColorScheme: (scheme: ColorScheme) => void
  isDarkMode: boolean
}

const initialState: ThemeProviderState = {
  theme: "system",
  colorScheme: "pink",
  setTheme: () => null,
  setColorScheme: () => null,
  isDarkMode: false,
}

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorScheme = "pink",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [colorScheme, setColorScheme] = useState<ColorScheme>(defaultColorScheme)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  useEffect(() => {
    const root = window.document.documentElement
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem("ui-theme") as Theme
    const savedColorScheme = localStorage.getItem("ui-color-scheme") as ColorScheme
    
    if (savedTheme) {
      setTheme(savedTheme)
    }
    
    if (savedColorScheme) {
      setColorScheme(savedColorScheme)
    }
    
    // Apply color scheme
    root.classList.remove("theme-pink", "theme-purple", "theme-blue", "theme-mint")
    root.classList.add(`theme-${savedColorScheme || defaultColorScheme}`)
  }, [defaultColorScheme])

  // Watch for theme changes
  useEffect(() => {
    const root = window.document.documentElement
    
    // Save preference
    localStorage.setItem("ui-theme", theme)
    
    // Remove all theme classes
    root.classList.remove("light", "dark")
    
    // Check if should use dark mode
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
      setIsDarkMode(systemTheme === "dark")
    } else {
      root.classList.add(theme)
      setIsDarkMode(theme === "dark")
    }
  }, [theme])

  // Watch for color scheme changes
  useEffect(() => {
    const root = window.document.documentElement
    
    // Save preference
    localStorage.setItem("ui-color-scheme", colorScheme)
    
    // Apply color scheme
    root.classList.remove("theme-pink", "theme-purple", "theme-blue", "theme-mint")
    root.classList.add(`theme-${colorScheme}`)
  }, [colorScheme])

  // Watch for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    
    const handleChange = () => {
      if (theme === "system") {
        const root = window.document.documentElement
        const systemTheme = mediaQuery.matches ? "dark" : "light"
        
        root.classList.remove("light", "dark")
        root.classList.add(systemTheme)
        setIsDarkMode(systemTheme === "dark")
      }
    }
    
    mediaQuery.addEventListener("change", handleChange)
    
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  const value = {
    theme,
    colorScheme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme)
    },
    setColorScheme: (newScheme: ColorScheme) => {
      setColorScheme(newScheme)
    },
    isDarkMode,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
    
  return context
}