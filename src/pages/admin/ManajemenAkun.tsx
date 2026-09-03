import React, { useState, useEffect } from 'react';
import {
  getAdminUsers,
  saveAdminUser,
  deleteAdminUser,
  getAuthenticatedUser,
  updateAdminProfile,
} from '../../utils/auth';
import { getPeople } from '../../utils/storage';
import { AdminUser, AdminRole, Person } from '../../types';
import { usePermission, Permission } from '../../utils/permissions';
import {
  UserCheck,
  Plus,
  Edit2,
  Trash2,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  X,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ShieldAlert,
} from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';

export default function ManajemenAkun() {
  const { can } = usePermission();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(getAuthenticatedUser());

  // Modal State for Add / Edit User
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<AdminUser> | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // My Profile Form State
  const [myProfile, setMyProfile] = useState({
    full_name: currentUser?.full_name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    avatar: currentUser?.avatar || '',
  });

  // Password Change Form State
  const [passForm, setPassForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = () => {
    const userList = getAdminUsers();
    setUsers(userList);
    setPeople(getPeople());
    const auth = getAuthenticatedUser();
    setCurrentUser(auth);
    if (auth) {
      setMyProfile({
        full_name: auth.full_name,
        email: auth.email,
        phone: auth.phone || '',
        avatar: auth.avatar || '',
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingUser({
      id: 'adm-' + Date.now(),
      full_name: '',
      email: '',
      password: '',
      role: 'admin',
      phone: '',
      avatar: '',
      status: 'active',
    });
    setShowPassword(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser({ ...user });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editingUser.full_name || !editingUser.email) {
      showNotification('error', 'Nama lengkap dan email wajib diisi.');
      return;
    }

    if (!can(Permission.MANAGE_USERS) && !can(Permission.CREATE_USERS)) {
      showNotification('error', 'Akses ditolak: Anda tidak memiliki izin untuk mengelola akun pengguna.');
      return;
    }

    // Role escalation check
    if (editingUser.role === 'superadmin' && !can(Permission.MANAGE_ROLES)) {
      showNotification('error', 'Akses ditolak: Hanya Super Administrator yang dapat menetapkan role Super Administrator.');
      return;
    }

    const userToSave: AdminUser = {
      id: editingUser.id || 'adm-' + Date.now(),
      full_name: editingUser.full_name.trim(),
      email: editingUser.email.trim().toLowerCase(),
      password: editingUser.password || 'admin123',
      role: (editingUser.role as AdminRole) || 'admin',
      phone: editingUser.phone || '',
      avatar: editingUser.avatar || '',
      linked_person_id: editingUser.linked_person_id || '',
      status: editingUser.status || 'active',
      created_at: editingUser.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: editingUser.last_login,
    };

    saveAdminUser(userToSave);
    loadData();
    setIsModalOpen(false);
    showNotification('success', `Akun ${userToSave.full_name} berhasil disimpan!`);
  };

  const handleDelete = (id: string, name: string) => {
    if (!can(Permission.DELETE_USERS) && !can(Permission.MANAGE_USERS)) {
      showNotification('error', 'Akses ditolak: Anda tidak memiliki izin untuk menghapus akun.');
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus akun pengelola "${name}"?`)) {
      const result = deleteAdminUser(id);
      if (result.success) {
        showNotification('success', `Akun ${name} berhasil dihapus.`);
        loadData();
      } else {
        showNotification('error', result.error || 'Gagal menghapus akun.');
      }
    }
  };

  const handleSaveMyProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateAdminProfile({
      full_name: myProfile.full_name.trim(),
      email: myProfile.email.trim().toLowerCase(),
      phone: myProfile.phone.trim(),
      avatar: myProfile.avatar,
    });
    setCurrentUser(updated);
    loadData();
    showNotification('success', 'Profil akun Anda berhasil diperbarui!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passForm.newPassword || passForm.newPassword.length < 6) {
      showNotification('error', 'Kata sandi baru minimal 6 karakter.');
      return;
    }
    if (passForm.newPassword !== passForm.confirmPassword) {
      showNotification('error', 'Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    if (currentUser) {
      const updatedUser: AdminUser = {
        ...currentUser,
        password: passForm.newPassword,
      };
      saveAdminUser(updatedUser);
      setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      showNotification('success', 'Kata sandi akun Anda berhasil diperbarui!');
    }
  };

  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case 'superadmin':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            Super Administrator
          </span>
        );
      case 'admin':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Administrator
          </span>
        );
      case 'editor':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Redaksi / Editor
          </span>
        );
      case 'operator':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Operator Dapodik / IT
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-yellow-500" />
            <span>Manajemen Akun & Hak Akses Pengelola</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola data akun administrator, pembagian wewenang peran (role), kredensial login, dan informasi profil pribadi.
          </p>
        </div>

        {can(Permission.CREATE_USERS) && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Akun Baru</span>
          </button>
        )}
      </div>

      {notification && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 animate-in fade-in duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Grid: 2 Columns on Desktop */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Daftar Pengguna Administrator */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-yellow-500" />
              <span>Daftar Akun Pengelola ({users.length})</span>
            </h2>
            <span className="text-xs text-slate-400">SMP Pancasila CMS</span>
          </div>

          <div className="grid gap-3">
            {users.map((u) => {
              const isMe = currentUser?.id === u.id;
              return (
                <div
                  key={u.id}
                  className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border transition-all ${
                    isMe
                      ? 'border-yellow-500/60 shadow-sm ring-1 ring-yellow-500/20'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center overflow-hidden shrink-0 font-bold text-sm text-yellow-600 dark:text-yellow-400">
                        {u.avatar ? (
                          <img
                            src={u.avatar}
                            alt={u.full_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          u.full_name.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {u.full_name}
                          </h3>
                          {isMe && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-yellow-500 text-slate-950">
                              Akun Anda
                            </span>
                          )}
                          {getRoleBadge(u.role)}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />
                            {u.email}
                          </span>
                          {u.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" />
                              {u.phone}
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-400 mt-1">
                          Status:{' '}
                          <span
                            className={`font-semibold ${
                              u.status === 'active'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-slate-400'
                            }`}
                          >
                            {u.status === 'active' ? 'Aktif' : 'Nonaktif'}
                          </span>
                          {u.last_login && (
                            <span className="ml-2">
                              • Masuk terakhir:{' '}
                              {new Date(u.last_login).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      {(can(Permission.EDIT_USERS) || isMe) && (
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-2 rounded-xl text-slate-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-slate-700 transition-colors"
                          title="Edit Data Akun"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      {can(Permission.DELETE_USERS) && (
                        <button
                          onClick={() => handleDelete(u.id, u.full_name)}
                          disabled={isMe || users.length <= 1}
                          className={`p-2 rounded-xl transition-colors ${
                            isMe || users.length <= 1
                              ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                              : 'text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-700'
                          }`}
                          title={
                            isMe
                              ? 'Tidak bisa menghapus akun yang sedang aktif'
                              : 'Hapus Akun'
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (1 col): Profil Saya & Ganti Password */}
        <div className="space-y-6">
          {/* My Profile Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <User className="w-4 h-4 text-yellow-500" />
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Profil Akun Saya
              </h2>
            </div>

            <form onSubmit={handleSaveMyProfile} className="space-y-4">
              <ImageUpload
                label="Foto Avatar Saya"
                value={myProfile.avatar}
                onChange={(val) => setMyProfile({ ...myProfile, avatar: val })}
                aspectRatio="square"
                helperText="Upload foto profil Anda (opsional)."
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={myProfile.full_name}
                  onChange={(e) => setMyProfile({ ...myProfile, full_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Login *
                </label>
                <input
                  type="email"
                  required
                  value={myProfile.email}
                  onChange={(e) => setMyProfile({ ...myProfile, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  value={myProfile.phone}
                  onChange={(e) => setMyProfile({ ...myProfile, phone: e.target.value })}
                  placeholder="0812-3456-7890"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-yellow-500 text-white dark:text-slate-950 text-xs font-bold transition-all hover:opacity-90 active:scale-95"
              >
                Simpan Profil Saya
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <KeyRound className="w-4 h-4 text-yellow-500" />
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Ubah Kata Sandi
              </h2>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kata Sandi Baru *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={passForm.newPassword}
                  onChange={(e) =>
                    setPassForm({ ...passForm, newPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ulangi Kata Sandi Baru *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Ketik ulang kata sandi baru"
                  value={passForm.confirmPassword}
                  onChange={(e) =>
                    setPassForm({ ...passForm, confirmPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-black transition-all shadow-sm active:scale-95"
              >
                Perbarui Kata Sandi
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal Add / Edit User */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-yellow-500" />
                <span>
                  {editingUser.id && users.some((u) => u.id === editingUser.id)
                    ? 'Edit Akun Administrator'
                    : 'Tambah Akun Administrator Baru'}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <ImageUpload
                label="Foto Avatar Pengguna"
                value={editingUser.avatar || ''}
                onChange={(val) => setEditingUser({ ...editingUser, avatar: val })}
                aspectRatio="square"
                helperText="Upload foto profil pengguna (opsional)."
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.full_name || ''}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, full_name: e.target.value })
                  }
                  placeholder="Contoh: Siti Aisyah, S.Pd."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alamat Email Login *
                </label>
                <input
                  type="email"
                  required
                  value={editingUser.email || ''}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  placeholder="nama@smppancasilaponokawan.sch.id"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kata Sandi Login *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={editingUser.password || ''}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, password: e.target.value })
                    }
                    placeholder="Kata sandi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hak Akses / Peran *
                  </label>
                  <select
                    value={editingUser.role || 'admin'}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        role: e.target.value as AdminRole,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                  >
                    {can(Permission.MANAGE_ROLES) && (
                      <option value="superadmin">Super Administrator</option>
                    )}
                    <option value="admin">Administrator</option>
                    <option value="editor">Editor / Redaksi Berita</option>
                    <option value="operator">Operator Dapodik / IT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Status Akun
                  </label>
                  <select
                    value={editingUser.status || 'active'}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        status: e.target.value as 'active' | 'inactive',
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor HP / WhatsApp
                </label>
                <input
                  type="text"
                  value={editingUser.phone || ''}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, phone: e.target.value })
                  }
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                />
              </div>

              {people.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tautkan ke Profil Guru / Personel (Opsional)
                  </label>
                  <select
                    value={editingUser.linked_person_id || ''}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        linked_person_id: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                  >
                    <option value="">-- Tidak Ditautkan --</option>
                    {people.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.position})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-black shadow-md transition-all active:scale-95"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
