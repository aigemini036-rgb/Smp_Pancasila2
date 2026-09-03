import { AdminUser } from '../types';

const ADMIN_CURRENT_USER_KEY = 'smp_pancasila_admin_user';
const ADMIN_USERS_LIST_KEY = 'smp_pancasila_admin_users_list';

export const defaultAdminUsers: AdminUser[] = [
  {
    id: 'adm-001',
    full_name: 'Administrator Utama (Super Admin)',
    email: 'admin@smppancasilaponokawan.sch.id',
    password: 'admin123',
    role: 'superadmin',
    phone: '0812-3456-7890',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    status: 'active',
    last_login: new Date().toISOString(),
    created_at: '2026-01-01T00:00:00Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'adm-002',
    full_name: 'Humas & Publikasi Sekolah',
    email: 'humas@smppancasilaponokawan.sch.id',
    password: 'humas123',
    role: 'admin',
    phone: '0813-9876-5432',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    status: 'active',
    last_login: '2026-02-10T09:30:00Z',
    created_at: '2026-01-15T00:00:00Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'adm-003',
    full_name: 'Staf IT & Operator Dapodik',
    email: 'operator@smppancasilaponokawan.sch.id',
    password: 'operator123',
    role: 'operator',
    phone: '0857-1122-3344',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    status: 'active',
    last_login: '2026-02-12T14:15:00Z',
    created_at: '2026-01-20T00:00:00Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'adm-004',
    full_name: 'Redaktur Berita & Prestasi',
    email: 'redaksi@smppancasilaponokawan.sch.id',
    password: 'redaksi123',
    role: 'editor',
    phone: '0821-4455-6677',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    status: 'active',
    last_login: '2026-02-08T11:20:00Z',
    created_at: '2026-02-01T00:00:00Z',
    updated_at: new Date().toISOString(),
  },
];

export const defaultAdminUser = defaultAdminUsers[0];

export function getAdminUsers(): AdminUser[] {
  const stored = localStorage.getItem(ADMIN_USERS_LIST_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // ignore
    }
  }
  localStorage.setItem(ADMIN_USERS_LIST_KEY, JSON.stringify(defaultAdminUsers));
  return defaultAdminUsers;
}

export function saveAdminUsers(users: AdminUser[]): void {
  localStorage.setItem(ADMIN_USERS_LIST_KEY, JSON.stringify(users));
}

export function saveAdminUser(user: AdminUser): void {
  const current = getAdminUsers();
  const index = current.findIndex((u) => u.id === user.id);
  if (index >= 0) {
    current[index] = { ...user, updated_at: new Date().toISOString() };
  } else {
    current.unshift({
      ...user,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  saveAdminUsers(current);

  // If saving the currently logged in user, update session
  const currentUser = getAuthenticatedUser();
  if (currentUser && currentUser.id === user.id) {
    const updatedCurrent = { ...currentUser, ...user, updated_at: new Date().toISOString() };
    localStorage.setItem(ADMIN_CURRENT_USER_KEY, JSON.stringify(updatedCurrent));
  }
}

export function deleteAdminUser(id: string): { success: boolean; error?: string } {
  const current = getAdminUsers();
  const currentUser = getAuthenticatedUser();
  if (currentUser && currentUser.id === id) {
    return { success: false, error: 'Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif digunakan.' };
  }
  if (current.length <= 1) {
    return { success: false, error: 'Setidaknya harus ada minimal satu akun Administrator aktif dalam sistem.' };
  }
  const filtered = current.filter((u) => u.id !== id);
  saveAdminUsers(filtered);
  return { success: true };
}

export function getAuthenticatedUser(): AdminUser | null {
  const stored = localStorage.getItem(ADMIN_CURRENT_USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function loginAdmin(email: string, pass: string): { success: boolean; error?: string; user?: AdminUser } {
  const users = getAdminUsers();
  const cleanEmail = email.trim().toLowerCase();
  
  // Find matching user
  const found = users.find(
    (u) => u.email.toLowerCase() === cleanEmail && (u.password ? u.password === pass : pass === 'admin123')
  );

  if (found) {
    if (found.status === 'inactive') {
      return { success: false, error: 'Akun ini sedang dinonaktifkan oleh Super Administrator. Hubungi pengelola sistem.' };
    }
    const loggedInUser: AdminUser = {
      ...found,
      last_login: new Date().toISOString(),
    };
    saveAdminUser(loggedInUser);
    localStorage.setItem(ADMIN_CURRENT_USER_KEY, JSON.stringify(loggedInUser));
    return { success: true, user: loggedInUser };
  }

  // Fallback demo for any @ domain if match not found but valid email format
  if (cleanEmail.includes('@') && pass.length >= 4) {
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'Kata sandi yang Anda masukkan salah. Silakan coba lagi.' };
    }
    // Create new temporary session user
    const newUser: AdminUser = {
      id: 'adm-' + Date.now(),
      email: cleanEmail,
      full_name: cleanEmail.split('@')[0].toUpperCase(),
      role: 'admin',
      password: pass,
      status: 'active',
      last_login: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    saveAdminUser(newUser);
    localStorage.setItem(ADMIN_CURRENT_USER_KEY, JSON.stringify(newUser));
    return { success: true, user: newUser };
  }

  return {
    success: false,
    error: 'Email atau kata sandi tidak valid. Gunakan akun: admin@smppancasilaponokawan.sch.id / admin123',
  };
}

export function logoutAdmin(): void {
  localStorage.removeItem(ADMIN_CURRENT_USER_KEY);
}

export function updateAdminProfile(updated: Partial<AdminUser>): AdminUser {
  const current = getAuthenticatedUser() || defaultAdminUser;
  const newProfile = { ...current, ...updated, updated_at: new Date().toISOString() };
  localStorage.setItem(ADMIN_CURRENT_USER_KEY, JSON.stringify(newProfile));
  
  // Also update in users list
  const users = getAdminUsers();
  const idx = users.findIndex((u) => u.id === newProfile.id);
  if (idx >= 0) {
    users[idx] = newProfile;
    saveAdminUsers(users);
  }
  
  return newProfile;
}
