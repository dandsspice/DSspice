import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import { ThemeProvider } from './context/ThemeContext'
import { CartProvider } from './context/CartContext'
import LandingPage from './pages/landingPage'
import ProductsPage from './pages/ProductsPage'
import ProductPage from './pages/ProductsPage'
import CheckoutPage from './pages/CheckoutPage'
import ThemeToggle from './components/ThemeToggle'
import CartDrawer from './components/checkout/CartDrawer'

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <CartProvider>
          <MainLayout>
            <div className="min-h-screen bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary">
              {/* Fixed position theme toggle */}
              <div className="fixed bottom-4 right-4 z-50">
                
                  <ThemeToggle />
                
              </div>
              
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                {/* Add other routes as we build them */}
              </Routes>

              <CartDrawer />
            </div>
          </MainLayout>
        </CartProvider>
      </ThemeProvider>
    </Router>
  )
}