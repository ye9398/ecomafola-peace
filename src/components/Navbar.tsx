import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, X as XIcon, ChevronDown, User, LogOut, Search as SearchIcon } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const products = [
  { name: 'Coconut Bowls', href: '/products/category/coconut-bowls' },
  { name: 'Shell Jewelry', href: '/products/category/shell-jewelry' },
  { name: 'Artisan Carvings', href: '/products/category/wood-carvings' },
  { name: 'Woven Accessories', href: '/products/category/woven-baskets' },
  { name: 'Natural Soaps', href: '/products/category/natural-soaps' },
  { name: 'Traditional Textiles', href: '/products/category/textiles' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const productsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  // Hooks with safety checks
  const cartContext = useCart()
  const authContext = useAuth()
  const navigate = useNavigate()

  // Ensure hooks are called correctly and handle potential undefined values
  const count = cartContext?.count || 0
  const setIsOpen = cartContext?.setIsOpen || (() => {})
  const user = authContext?.user || null
  const logout = authContext?.logout || (() => {})

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
      setMobileOpen(false)
    }
  }

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
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Announcement Bar */}
      <div className="bg-ocean-blue text-white text-[10px] md:text-xs font-sans font-bold py-2 text-center tracking-widest uppercase px-4 flex items-center justify-center gap-2">
        <span className="hidden sm:inline">✨</span> 
        Free worldwide shipping on all orders over $45 
        <span className="hidden sm:inline">✨</span>
      </div>
      
      <nav className={`transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-gradient-to-b from-black/50 to-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 overflow-hidden">
               <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className={`font-serif font-bold text-base md:text-xl tracking-tight transition-colors duration-300 ${
              isScrolled ? 'text-ocean-blue' : 'text-white'
            }`}>
              EcoMafola Peace
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link to="/" className={`font-sans text-xs font-bold uppercase tracking-widest transition-colors duration-200 hover:text-tropical-green ${
              isScrolled ? 'text-ocean-blue/70' : 'text-white/80'
            }`}>
              Home
            </Link>

            {/* Products Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (productsTimeoutRef.current) clearTimeout(productsTimeoutRef.current)
                setProductsOpen(true)
              }}
              onMouseLeave={() => {
                if (productsTimeoutRef.current) clearTimeout(productsTimeoutRef.current)
                productsTimeoutRef.current = setTimeout(() => setProductsOpen(false), 500)
              }}
            >
              <Link
                to="/products"
                className={`flex items-center gap-1 font-sans text-xs font-bold uppercase tracking-widest transition-colors duration-200 hover:text-tropical-green ${
                  isScrolled ? 'text-ocean-blue/70' : 'text-white/80'
                }`}
              >
                Products<ChevronDown size={14} className={`transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`} />
              </Link>
              {productsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-50 py-3 overflow-hidden animate-fade-in-down z-50">
                  {products.map((p) => (
                    <Link key={p.name} to={p.href} className="block px-6 py-2.5 text-sm text-gray-700 hover:bg-coral-white hover:text-tropical-green font-sans font-semibold transition-colors duration-150">
                      {p.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/our-story" className={`font-sans text-xs font-bold uppercase tracking-widest transition-colors duration-200 hover:text-tropical-green ${
              isScrolled ? 'text-ocean-blue/70' : 'text-white/80'
            }`}>
              Our Story
            </Link>
            <Link to="/impact" className={`font-sans text-xs font-bold uppercase tracking-widest transition-colors duration-200 hover:text-tropical-green ${
              isScrolled ? 'text-ocean-blue/70' : 'text-white/80'
            }`}>
              Impact
            </Link>
            <Link to="/contact" className={`font-sans text-xs font-bold uppercase tracking-widest transition-colors duration-200 hover:text-tropical-green ${
              isScrolled ? 'text-ocean-blue/70' : 'text-white/80'
            }`}>
              Contact
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-4">
            {/* Search Bar (Expanding) */}
            <div className="flex items-center relative">
              <form 
                onSubmit={handleSearch} 
                className={`hidden sm:flex items-center transition-all duration-300 ${isSearchOpen ? 'w-48 lg:w-64 opacity-100' : 'w-0 opacity-0'} overflow-hidden`}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search Pacific treasures..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`border rounded-full px-5 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-tropical-green/30 w-full transition-all duration-300 ${
                    isScrolled 
                      ? 'text-ocean-blue bg-gray-100 border-gray-200' 
                      : 'text-white placeholder-white/70 bg-white/10 border-white/30 backdrop-blur-md'
                  }`}
                />
              </form>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2.5 rounded-full transition-all duration-200 hover:bg-black/5 active:scale-95 ${
                  isScrolled ? 'text-ocean-blue' : 'text-white'
                }`}
                aria-label="Search"
              >
                {isSearchOpen ? <XIcon size={20} /> : <SearchIcon size={20} />}
              </button>
            </div>

            {/* Login/User Button */}
            {user ? (
              <div className="flex items-center gap-1 md:gap-2">
                <Link
                  to="/account"
                  className={`flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest transition-colors duration-200 hover:text-tropical-green ${
                    isScrolled ? 'text-ocean-blue/70' : 'text-white/80'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-tropical-green/20 flex items-center justify-center text-tropical-green">
                    <User size={16} />
                  </div>
                  <span className="hidden lg:inline">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className={`p-2 rounded-full transition-all duration-200 hover:bg-black/5 ${
                    isScrolled ? 'text-ocean-blue' : 'text-white'
                  }`}
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all duration-300 shadow-sm ${
                  isScrolled
                    ? 'text-white bg-ocean-blue hover:bg-tropical-green hover:shadow-lg'
                    : 'text-ocean-blue bg-white hover:bg-sand-beige hover:shadow-lg'
                }`}
              >
                <User size={16} />
                <span className="hidden xs:inline">Login</span>
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={() => setIsOpen(true)}
              className={`relative p-2.5 rounded-full transition-all duration-200 hover:bg-black/5 active:scale-95 ${
                isScrolled ? 'text-ocean-blue' : 'text-white'
              }`}
              aria-label="Open shopping cart"
            >
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-coral-pink text-white text-[10px] rounded-full flex items-center justify-center font-sans font-bold shadow-md border-2 border-white animate-pop">
                  {count}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className={`md:hidden p-2.5 rounded-full transition-all duration-200 active:scale-95 ${
                isScrolled ? 'text-ocean-blue' : 'text-white'
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <XIcon size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-8 px-6 space-y-6 shadow-2xl animate-fade-in-down">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="relative mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-tropical-green/20 text-gray-800"
            />
            <button type="submit" className="absolute right-5 top-4 text-gray-400">
              <SearchIcon size={22} />
            </button>
          </form>

          <div className="space-y-4">
            {['Home', 'Products', 'Our Story', 'Impact', 'Contact'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase().replace(' ', '-') === 'home' ? '' : item.toLowerCase().replace(' ', '-')}`}
                className="block py-4 text-ocean-blue font-serif text-xl font-bold border-b border-gray-50 last:border-0 hover:text-tropical-green transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
          
          <div className="pt-8 border-t border-gray-100 flex flex-col gap-4">
            {user ? (
              <>
                <Link
                  to="/account"
                  className="flex items-center justify-center gap-3 py-4 bg-gray-50 rounded-2xl text-base font-sans font-bold text-ocean-blue"
                  onClick={() => setMobileOpen(false)}
                >
                  <User size={20} />
                  My Account
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="flex items-center justify-center gap-3 py-4 bg-gray-50 rounded-2xl text-base font-sans font-bold text-gray-500"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center gap-3 py-4 bg-ocean-blue text-white rounded-2xl text-base font-sans font-bold shadow-lg hover:bg-tropical-green transition-all"
                onClick={() => setMobileOpen(false)}
              >
                <User size={20} />
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  </div>
  )
}
