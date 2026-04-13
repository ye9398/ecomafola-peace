import { Suspense } from 'react'
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
import { BlogListPage, BlogPostPage } from './pages/BlogPage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import NotFoundPage from './pages/NotFoundPage'
import { AuthProvider } from './context/AuthContext'
import AnnouncementBar from './components/AnnouncementBar'
import { AnalyticsProvider } from './components/AnalyticsProvider'

// 管理后台页面（独立布局，无 Navbar/Footer）
import AdminLogin from './pages/admin/AdminLogin'
import AdminPage from './pages/admin/AdminPage'
import ProductContentAdmin from './pages/admin/ProductContentAdmin'
import HomeContentAdmin from './pages/admin/HomeContentAdmin'
import BlogContentAdmin from './pages/admin/BlogContentAdmin'

// 懒加载页面组件
import {
  LazyProductDetailPage,
  LazyCheckoutPage,
  LazyAccountOrdersPage,
  ProductDetailSuspense,
  CheckoutSuspense,
  AccountOrdersSuspense,
} from './components/LazyLoading'

function App() {
  const ga4MeasurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID

  return (
   <AnalyticsProvider ga4MeasurementId={ga4MeasurementId}>
    <AuthProvider>
     <AnnouncementBar />
     <Routes>
       {/* 管理后台路由 - 独立布局，无 Navbar/Footer */}
       <Route path="/dashboard/login" element={<AdminLogin />} />
       <Route path="/dashboard" element={<AdminPage />} />
       <Route path="/dashboard/products" element={<ProductContentAdmin />} />
       <Route path="/dashboard/home" element={<HomeContentAdmin />} />
       <Route path="/dashboard/blog" element={<BlogContentAdmin />} />

       {/* 前台页面路由 - 带 Navbar/Footer */}
       <Route path="/" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main><HomePage /></main>
           <Footer />
         </div>
       } />
       
       {/* 产品列表 & 分类列表 */}
       <Route path="/products" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main><ProductListPage /></main>
           <Footer />
         </div>
       } />
       <Route path="/products/category/:category" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main><ProductListPage /></main>
           <Footer />
         </div>
       } />

       {/* 产品详情 - 支持 /product/:id 和 /products/:id 双路径 */}
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
       <Route path="/products/:id" element={
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
       <Route path="/blog" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main><BlogListPage /></main>
           <Footer />
         </div>
       } />
       <Route path="/blog/:id" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main><BlogPostPage /></main>
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
       <Route path="*" element={<NotFoundPage />} />
     </Routes>

     {/* 全局购物车抽屉 */}
     <SlideOverCheckout />
   </AuthProvider>
   </AnalyticsProvider>
  )
}

export default App
