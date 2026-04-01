import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CheckoutPage from './pages/CheckoutPage'
import TrackOrderPage from './pages/TrackOrderPage'
import { OurStoryPage, ImpactPage, ContactPage } from './pages/SubPages'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { AuthProvider } from './context/AuthContext'
// 管理后台路由（独立模块，不影响现有功能）
import AdminRoutes from './pages/admin/AdminRoutes'

function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/dashboard')

  // 管理后台路由 - 独立布局，无 Navbar/Footer
  if (isAdminRoute) {
    return <AdminRoutes />
  }

  // 前台页面路由 - 带 Navbar/Footer
  return (
    <div className="min-h-screen bg-coral-white">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:category" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/track" element={<TrackOrderPage />} />
          <Route path="/our-story" element={<OurStoryPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
   <AuthProvider>
     <AppContent />
   </AuthProvider>
  )
}

export default App
