import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  // Initialize state from localStorage, default to 'light'
  const [darkMode, setDarkMode] = useState(() => {
    // Get the stored theme from localStorage
    const storedTheme = localStorage.getItem('theme')
    // Return false for light mode if no theme is stored
    return storedTheme === 'dark'
  })

  // Apply theme on initial load and when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode
      localStorage.setItem('theme', newMode ? 'dark' : 'light')
      return newMode
    })
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 