import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingSkeleton from './components/LoadingSkeleton'
import SlideOverCheckout from './components/SlideOverCheckout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AuthCallback from './pages/AuthCallback'
import AccountPage from './pages/AccountPage'
import ProductListPage from './pages/ProductListPage'
import TrackOrderPage from './pages/TrackOrderPage'
import { OurStoryPage, ImpactPage, ContactPage } from './pages/SubPages'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { AuthProvider } from './context/AuthContext'

// 懒加载页面组件
import {
  LazyProductDetailPage,
  LazyCheckoutPage,
  LazyAccountOrdersPage,
  ProductDetailSuspense,
  CheckoutSuspense,
  AccountOrdersSuspense,
} from './components/LazyLoading'

// 管理后台懒加载（避免静态+动态双重引用）
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminPage = lazy(() => import('./pages/admin/AdminPage'))
const ProductContentAdmin = lazy(() => import('./pages/admin/ProductContentAdmin'))
const HomeContentAdmin = lazy(() => import('./pages/admin/HomeContentAdmin'))

/** 管理后台 Suspense 容器 */
function AdminSuspense({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><span className="text-xl text-gray-600">加载中...</span></div>}>{children}</Suspense>
}

function App() {
  return (
   <AuthProvider>
     <Routes>
       {/* 管理后台路由 - 独立布局，无 Navbar/Footer */}
       <Route path="/dashboard/login" element={<AdminSuspense><AdminLogin /></AdminSuspense>} />
       <Route path="/dashboard" element={<AdminSuspense><AdminPage /></AdminSuspense>} />
       <Route path="/dashboard/products" element={<AdminSuspense><ProductContentAdmin /></AdminSuspense>} />
       <Route path="/dashboard/home" element={<AdminSuspense><HomeContentAdmin /></AdminSuspense>} />

       {/* 前台页面路由 - 带 Navbar/Footer */}
       <Route path="/" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main><HomePage /></main>
           <Footer />
         </div>
       } />
       <Route path="/products" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main><ProductListPage /></main>
           <Footer />
         </div>
       } />
       <Route path="/products/:category" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main><ProductListPage /></main>
           <Footer />
         </div>
       } />
       <Route path="/product/:id" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main>
             <ProductDetailSuspense>
               <LazyProductDetailPage />
             </ProductDetailSuspense>
           </main>
           <Footer />
         </div>
       } />
       <Route path="/checkout" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main>
             <CheckoutSuspense>
               <LazyCheckoutPage />
             </CheckoutSuspense>
           </main>
           <Footer />
         </div>
       } />
       <Route path="/track" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main><TrackOrderPage /></main>
           <Footer />
         </div>
       } />
       <Route path="/account/orders" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main>
             <AccountOrdersSuspense fallback={<LoadingSkeleton />}>
               <LazyAccountOrdersPage />
             </AccountOrdersSuspense>
           </main>
           <Footer />
         </div>
       } />
       <Route path="/login" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main><LoginPage /></main>
           <Footer />
         </div>
       } />
       <Route path="/auth/callback" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main><AuthCallback /></main>
           <Footer />
         </div>
       } />
       <Route path="/account" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main><AccountPage /></main>
           <Footer />
         </div>
       } />
       <Route path="/our-story" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main><OurStoryPage /></main>
           <Footer />
         </div>
       } />
       <Route path="/impact" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main><ImpactPage /></main>
           <Footer />
         </div>
       } />
       <Route path="/contact" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main><ContactPage /></main>
           <Footer />
         </div>
       } />
       <Route path="/privacy-policy" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main><PrivacyPolicyPage /></main>
           <Footer />
         </div>
       } />
       <Route path="*" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main><HomePage /></main>
           <Footer />
         </div>
       } />
     </Routes>

     {/* 全局购物车抽屉 */}
     <SlideOverCheckout />
   </AuthProvider>
  )
}

export default App
