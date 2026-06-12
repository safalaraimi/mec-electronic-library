import { useState } from 'react';
import { useNavigate } from 'react-router';
import { BookOpen, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Navy Header */}
        <div className="relative pt-10 pb-16 px-6 text-center" style={{ backgroundColor: '#1B3A8C' }}>
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full p-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-white text-xl" style={{ fontWeight: 700, letterSpacing: '0.08em' }}>MEC</p>
              <p className="text-white text-xs" style={{ letterSpacing: '0.2em', opacity: 0.8 }}>ELECTRONIC LIBRARY</p>
            </div>
          </div>

          {/* Wave SVG */}
          <div className="absolute -bottom-px left-0 right-0">
            <svg viewBox="0 0 400 55" xmlns="http://www.w3.org/2000/svg" className="w-full block">
              <path d="M0,35 C80,55 150,10 200,28 C250,46 320,5 400,22 L400,55 L0,55 Z" fill="white" />
            </svg>
          </div>
        </div>

        {/* Form Area */}
        <div className="px-8 pt-2 pb-8">
          <h2 className="text-gray-900 text-center mb-1" style={{ fontWeight: 700, fontSize: '1.4rem' }}>Welcome Back!</h2>
          <p className="text-gray-500 text-sm text-center mb-6">Please login to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm text-gray-700 mb-1" style={{ fontWeight: 500 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-sm transition-colors"
                style={{ fontSize: '0.875rem' }}
                onFocus={e => (e.target.style.borderColor = '#1B3A8C')}
                onBlur={e => (e.target.style.borderColor = '#d1d5db')}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-1" style={{ fontWeight: 500 }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-sm pr-10 transition-colors"
                  onFocus={e => (e.target.style.borderColor = '#1B3A8C')}
                  onBlur={e => (e.target.style.borderColor = '#d1d5db')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: '#1B3A8C' }}
                />
                Remember me
              </label>
              <button type="button" className="text-sm hover:underline" style={{ color: '#1B3A8C' }}>
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 text-white rounded-lg text-sm transition-opacity hover:opacity-90 active:opacity-80"
              style={{ backgroundColor: '#1B3A8C', fontWeight: 600 }}
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <button className="hover:underline" style={{ color: '#1B3A8C', fontWeight: 600 }}>Sign up</button>
          </p>
        </div>
      </div>
    </div>
  );
}
