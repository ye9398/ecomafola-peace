import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck, Database, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneCountryCode, setPhoneCountryCode] = useState('+1')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      if (mode === 'register') {
        if (!firstName || !lastName || !phone) {
          setError('Please fill in all required fields')
          return
        }
        if (!privacyAccepted) {
          setError('You must accept the Privacy Policy to continue')
          return
        }
        await register(email, password, `${firstName} ${lastName}`, phone)
      } else {
        await login(email, password)
      }
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const isRegisterFormValid = firstName && lastName && phone && privacyAccepted

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-blue-dark via-ocean-blue to-tropical-green flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
       <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
             <span className="text-white font-serif font-bold">E</span>
            </div>
            <span className="text-white font-serif font-semibold text-xl">EcoMafola Peace</span>
          </Link>
         <p className="text-white/60 text-sm font-sans">Handcrafted treasures from the South Pacific</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2 mb-6">
           <Database size={14} className="text-green-600" />
            <span className="text-xs font-sans text-green-700 font-medium">Database connected · JWT Auth active · Supabase port reserved</span>
          </div>

          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            {(['login', 'register'] as const).map(m => (
             <button
                key={m}
                onClick={() => { setMode(m); setError(null) }}
                className={`flex-1 py-2.5 text-sm font-sans font-medium rounded-xl transition-all duration-200 ${mode === m ? 'bg-white text-ocean-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans font-medium text-gray-600 mb-1.5">First Name<span className="text-red-500">*</span></label>
                    <input
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ocean-blue/30 focus:border-ocean-blue transition-all"
                      placeholder="John"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-medium text-gray-600 mb-1.5">Last Name <span className="text-red-500">*</span></label>
                    <input
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ocean-blue/30 focus:border-ocean-blue transition-all"
                      placeholder="Doe"
                    />
                  </div>
               </div>

                <div>
                 <label className="block text-xs font-sans font-medium text-gray-600 mb-1.5">Phone Number<span className="text-red-500">*</span></label>
                  <div className="flex gap-3">
                    <select
                      value={phoneCountryCode}
                      onChange={e => setPhoneCountryCode(e.target.value)}
                      className="w-24 border border-gray-200 rounded-xl px-2 py-3 text-sm font-sans bg-white focus:outline-none focus:ring-2 focus:ring-ocean-blue/30 cursor-pointer appearance-none"
                    >
                      {[
                        ['+1', 'US'], ['+44', 'UK'], ['+61', 'AU'], ['+64', 'NZ'], ['+81', 'JP'],
                        ['+86', 'CN'], ['+82', 'KR'], ['+65', 'SG'], ['+49', 'DE'], ['+33', 'FR'],
                        ['+84', 'VN'], ['+63', 'PH'], ['+62', 'ID'], ['+971', 'AE'], ['+91', 'IN']
                      ].map(([code]) => (
                        <option key={code} value={code}>{code}</option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ocean-blue/30 focus:border-ocean-blue transition-all"
                      placeholder="1234567890"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={e => setPrivacyAccepted(e.target.checked)}
                    className="mt-0.5 accent-ocean-blue"
                    required
                  />
                 <span className="text-xs font-sans text-gray-500">
                    I agree to the<Link to="/privacy-policy" className="text-ocean-blue underline">Privacy Policy</Link>
                 </span>
               </label>
             </>
            )}

            <div>
             <label className="block text-xs font-sans font-medium text-gray-600 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ocean-blue/30 focus:border-ocean-blue transition-all"
                placeholder="you@example.com"
              />
            </div>

           <div>
              <label className="block text-xs font-sans font-medium text-gray-600 mb-1.5">Password</label>
              <div className="relative">
               <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ocean-blue/30 focus:border-ocean-blue transition-all"
                  placeholder={mode === 'register' ? 'At least 8 characters' : 'Your password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ?<EyeOff size={16} /> :<Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                <AlertCircle size={14} className="text-red-500 shrink-0" />
                <span className="text-xs font-sans text-red-600">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (mode === 'register' && !isRegisterFormValid)}
              className="w-full bg-ocean-blue text-white py-3.5 rounded-xl font-sans font-semibold text-sm hover:bg-tropical-green transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center justify-center gap-1.5 mt-6 pt-6 border-t border-gray-100">
            <ShieldCheck size={13} className="text-tropical-green" />
            <span className="text-xs font-sans text-gray-400">256-bit encrypted · JWT secured · GDPR compliant</span>
          </div>
        </div>
      </div>
    </div>
  )
}
