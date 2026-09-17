import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginAdmin, getAuthenticatedUser } from '../../utils/auth';
import { GraduationCap, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import SchoolLogo from '../../components/common/SchoolLogo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // If user is already authenticated, seamlessly redirect to /admin or requested route
  useEffect(() => {
    const user = getAuthenticatedUser();
    if (user) {
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [navigate, location]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = loginAdmin(email, password);
    if (result.success) {
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Email atau kata sandi tidak cocok. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl space-y-6">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Website Sekolah</span>
        </Link>

        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <SchoolLogo size="lg" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Login Admin CMS
          </h1>
          <p className="text-xs text-slate-400">
            Portal Administrator SMP Pancasila Ponokawan Sidoarjo
          </p>
        </div>

        {/* Default Demo Credentials Helper */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-xs space-y-1">
          <p className="font-bold text-yellow-400">Kredensial Login Default Admin:</p>
          <p className="text-slate-300">Email: <code className="text-yellow-300">admin@pancasilaponokawan.sch.id</code></p>
          <p className="text-slate-300">Sandi: <code className="text-yellow-300">admin123</code></p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pancasilaponokawan.sch.id"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold text-xs transition-colors shadow-lg shadow-yellow-500/20"
          >
            Masuk ke Panel Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
