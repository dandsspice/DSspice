

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { CartProvider } from './context/CartContext'
import LandingPage from './pages/landingPage'
import ProductsPage from './pages/ProductsPage'
import ThemeToggle from './components/ThemeToggle'
import CheckoutPage from './pages/CheckoutPage'
import CartDrawer from './components/checkout/CartDrawer'

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary">
            {/* Fixed position theme toggle */}
            <div className="fixed bottom-4 right-4 z-50">
              
                <ThemeToggle />
              
            </div>
            
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              {/* Add other routes as we build them */}
            </Routes>

            <CartDrawer />
          </div>
        </Router>
      </CartProvider>
    </ThemeProvider>
  )
}