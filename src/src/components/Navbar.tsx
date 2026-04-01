import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, X, ChevronDown, User, LogOut } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const products = [
  { name: 'Coconut Bowls', href: '/products/coconut-bowls' },
  { name: 'Woven Baskets', href: '/products/woven-baskets' },
  { name: 'Natural Soaps', href: '/products/natural-soaps' },
  { name: 'Wood Carvings', href: '/products/wood-carvings' },
  { name: 'Traditional Textiles', href: '/products/textiles' },
  { name: 'Shell Jewelry', href: '/products/shell-jewelry' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const productsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeDelay = 1300
  const { count } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    return () => {
      if (productsTimeoutRef.current) clearTimeout(productsTimeoutRef.current)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white' : 'bg-gradient-to-b from-black/40 to-transparent'
    }`} style={{ backgroundColor: isScrolled ? '#ffffff' : 'transparent' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-tropical-green flex items-center justify-center">
              <span className="text-white font-serif font-bold text-sm">E</span>
            </div>
            <span className={`font-serif font-semibold text-lg tracking-tight transition-colors duration-300 ${
              isScrolled ? 'text-ocean-blue' : 'text-white'
            }`}>
              EcoMafola Peace
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`font-sans text-sm font-medium transition-colors duration-200 hover:text-tropical-green ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}>
              Home
            </Link>

            {/* Products Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (productsTimeoutRef.current) clearTimeout(productsTimeoutRef.current)
                productsTimeoutRef.current = setTimeout(() => setProductsOpen(true), 200)
              }}
              onMouseLeave={() => {
                if (productsTimeoutRef.current) clearTimeout(productsTimeoutRef.current)
                productsTimeoutRef.current = setTimeout(() => setProductsOpen(false), closeDelay)
              }}
            >
              <Link 
                to="/products" 
                className={`flex items-center gap-1 font-sans text-sm font-medium transition-colors duration-200 hover:text-tropical-green ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                Products<ChevronDown size={14} className={`transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`} />
              </Link>
              {productsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                  {products.map((p) => (
                    <Link key={p.name} to={p.href} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-coral-white hover:text-tropical-green font-sans transition-colors duration-150">
                      {p.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/our-story" className={`font-sans text-sm font-medium transition-colors duration-200 hover:text-tropical-green ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}>
              Our Story
            </Link>
            <Link to="/impact" className={`font-sans text-sm font-medium transition-colors duration-200 hover:text-tropical-green ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}>
              Impact
            </Link>
            <Link to="/contact" className={`font-sans text-sm font-medium transition-colors duration-200 hover:text-tropical-green ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}>
              Contact
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Login/User Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link 
                  to="/account" 
                  className={`flex items-center gap-1.5 font-sans text-sm font-medium transition-colors duration-200 hover:text-tropical-green ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  <User size={16} />
                  <span className="hidden lg:inline">{user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className={`p-1.5 rounded-full transition-colors duration-200 hover:bg-white/20 ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className={`flex items-center gap-1.5 font-sans text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200 ${
                  isScrolled 
                    ? 'text-ocean-blue hover:bg-ocean-blue/10' 
                    : 'text-white bg-white/20 hover:bg-white/30'
                }`}
              >
                <User size={16} />
                <span>Login</span>
              </Link>
            )}

            {/* Cart — links to checkout, shows real count */}
            <button
              onClick={() => navigate('/checkout')}
              className={`relative p-2 rounded-full transition-colors duration-200 hover:bg-white/20 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-tropical-green text-white text-xs rounded-full flex items-center justify-center font-sans font-semibold">
                  {count}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className={`md:hidden p-2 rounded-full transition-colors duration-200 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-3">
            {['Home', 'Products', 'Our Story', 'Impact', 'Contact'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase().replace(' ', '-') === 'home' ? '' : item.toLowerCase().replace(' ', '-')}`}
                className="block py-2 text-gray-700 font-sans text-sm font-medium hover:text-tropical-green"
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100 space-y-2">
              {user ? (
                <>
                  <Link
                    to="/account"
                    className="flex items-center gap-2 text-sm font-sans text-gray-700 hover:text-tropical-green"
                    onClick={() => setMobileOpen(false)}
                  >
                    <User size={16} />
                    {user.name}
                  </Link>
                  <button
                    onClick={() => { setMobileOpen(false); handleLogout(); }}
                    className="flex items-center gap-2 text-sm font-sans text-gray-700 hover:text-tropical-green"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-sm font-sans text-gray-700 hover:text-tropical-green"
                  onClick={() => setMobileOpen(false)}
                >
                  <User size={16} />
                  Login
                </Link>
              )}
              <button
                onClick={() => { setMobileOpen(false); navigate('/checkout') }}
                className="flex items-center gap-2 text-sm font-sans text-gray-700 hover:text-tropical-green"
              >
                <ShoppingCart size={16} />
                Cart {count > 0 && <span className="bg-tropical-green text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{count}</span>}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}