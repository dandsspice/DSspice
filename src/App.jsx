import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import LandingPage from './pages/landingPage'
import ThemeToggle from './components/ThemeToggle'

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary">
          <nav className="p-4">
            <ThemeToggle />
          </nav>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* Add other routes as we build them */}
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}