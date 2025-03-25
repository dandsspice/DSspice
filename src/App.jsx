import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import { ThemeProvider } from './context/ThemeContext'
import LandingPage from './pages/landingPage'
import OrderPage from './pages/OrderPage'
import CheckoutPage from './pages/CheckoutPage'
import ThemeToggle from './components/ThemeToggle'
import ContactPage from './pages/ContactPage'

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <MainLayout>
          <div className="min-h-screen bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary">
            {/* Fixed position theme toggle */}
            <div className="fixed bottom-4 right-4 z-50">
              <ThemeToggle />
            </div>
            
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              {/* Removed other routes */}
            </Routes>
            
            {/* Removed CartDrawer */}
          </div>
        </MainLayout>
      </ThemeProvider>
    </Router>
  )
}