import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-background-alt dark:bg-dark-background-alt"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? '🌙' : '☀️'}
    </button>
  )
} 