import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingSkeleton from './components/LoadingSkeleton'
import SlideOverCheckout from './components/SlideOverCheckout'
import LoginPage from './pages/LoginPage'
import AuthCallback from './pages/AuthCallback'
import AccountPage from './pages/AccountPage'
import TrackOrderPage from './pages/TrackOrderPage'
import { OurStoryPage, ImpactPage, ContactPage } from './pages/SubPages'
import { BlogListPage, BlogPostPage } from './pages/BlogPage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import NotFoundPage from './pages/NotFoundPage'
import ShippingReturnsPage from './pages/ShippingReturnsPage'
import FaqPage from './pages/FaqPage'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import AnnouncementBar from './components/AnnouncementBar'
import { AnalyticsProvider } from './components/AnalyticsProvider'

// 管理后台页面（懒加载，独立布局）
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminPage = lazy(() => import('./pages/admin/AdminPage'))
const ProductContentAdmin = lazy(() => import('./pages/admin/ProductContentAdmin'))
const HomeContentAdmin = lazy(() => import('./pages/admin/HomeContentAdmin'))
const BlogContentAdmin = lazy(() => import('./pages/admin/BlogContentAdmin'))

// 懒加载页面组件
import {
  LazyProductDetailPage,
  LazyCheckoutPage,
  LazyAccountOrdersPage,
  LazyHomePage,
  LazyProductListPage,
  ProductDetailSuspense,
  CheckoutSuspense,
  AccountOrdersSuspense,
} from './components/LazyLoading'

function App() {
  const ga4MeasurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID

  return (
   <AnalyticsProvider ga4MeasurementId={ga4MeasurementId}>
    <AuthProvider>
     <CartProvider>
     <AnnouncementBar />
     <Routes>
       {/* 管理后台路由 - 独立布局，无 Navbar/Footer */}
       <Route path="/dashboard/login" element={<Suspense fallback={<LoadingSkeleton />}><AdminLogin /></Suspense>} />
       <Route path="/dashboard" element={<Suspense fallback={<LoadingSkeleton />}><AdminPage /></Suspense>} />
       <Route path="/dashboard/products" element={<Suspense fallback={<LoadingSkeleton />}><ProductContentAdmin /></Suspense>} />
       <Route path="/dashboard/home" element={<Suspense fallback={<LoadingSkeleton />}><HomeContentAdmin /></Suspense>} />
       <Route path="/dashboard/blog" element={<Suspense fallback={<LoadingSkeleton />}><BlogContentAdmin /></Suspense>} />

       {/* 前台页面路由 - 带 Navbar/Footer */}
       <Route path="/" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main>
             <ProductDetailSuspense>
               <LazyHomePage />
             </ProductDetailSuspense>
           </main>
           <Footer />
         </div>
       } />
       
       {/* 产品列表 & 分类列表 */}
       <Route path="/products" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main>
             <ProductDetailSuspense>
               <LazyProductListPage />
             </ProductDetailSuspense>
           </main>
           <Footer />
         </div>
       } />
       <Route path="/products/category/:category" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main>
             <ProductDetailSuspense>
               <LazyProductListPage />
             </ProductDetailSuspense>
           </main>
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
       <Route path="/shipping-returns" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main><ShippingReturnsPage /></main>
           <Footer />
         </div>
       } />
       <Route path="/faq" element={
         <div className="min-h-screen bg-coral-white">
           <Navbar />
           <main><FaqPage /></main>
           <Footer />
         </div>
       } />
       <Route path="*" element={<NotFoundPage />} />
     </Routes>

     {/* 全局购物车抽屉 */}
     <SlideOverCheckout />
     </CartProvider>
   </AuthProvider>
   </AnalyticsProvider>
  )
}

export default App
