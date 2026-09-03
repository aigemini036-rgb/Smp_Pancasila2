import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut, Lock, Home } from 'lucide-react';
import { getAuthenticatedUser, logoutAdmin } from '../../utils/auth';
import { ROLE_DEFINITIONS, Permission } from '../../utils/permissions';

interface AccessDeniedProps {
  requiredPermission?: Permission;
  title?: string;
  message?: string;
}

export default function AccessDenied({
  requiredPermission,
  title = '403 — Akses Ditolak',
  message,
}: AccessDeniedProps) {
  const navigate = useNavigate();
  const user = getAuthenticatedUser();
  const roleInfo = user ? ROLE_DEFINITIONS[user.role] : null;

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white dark:bg-slate-800 rounded-3xl p-8 border border-red-500/30 dark:border-red-500/20 shadow-xl space-y-6 text-center">
        {/* Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-9 h-9" />
        </div>

        {/* Header */}
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 inline-block">
            SECURITY LEVEL: RESTRICTED
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            {message ||
              'Anda tidak memiliki wewenang (permission) yang cukup untuk mengakses halaman atau fitur ini.'}
          </p>
        </div>

        {/* Current User Clearance Card */}
        {user && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Status Akun Anda:
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  roleInfo?.badgeBg || 'bg-slate-100'
                } ${roleInfo?.badgeText || 'text-slate-700'} ${
                  roleInfo?.badgeBorder || 'border-slate-300'
                }`}
              >
                {roleInfo?.title || user.role}
              </span>
            </div>

            <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
              <p>
                <strong className="text-slate-900 dark:text-white">Nama Pengguna:</strong>{' '}
                {user.full_name}
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white">Email:</strong> {user.email}
              </p>
              {requiredPermission && (
                <p className="text-[11px] text-red-500 font-mono pt-1">
                  <Lock className="w-3 h-3 inline mr-1" />
                  Izin yang dibutuhkan: <code>[{requiredPermission}]</code>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/admin"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Ganti Akun Lain</span>
          </button>
        </div>
      </div>
    </div>
  );
}
