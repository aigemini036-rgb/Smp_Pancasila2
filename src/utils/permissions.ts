import { AdminRole, AdminUser } from '../types';
import { getAuthenticatedUser } from './auth';

export enum Permission {
  // Dashboard
  VIEW_DASHBOARD = 'dashboard.view',

  // Konten Publik - News
  VIEW_NEWS = 'news.view',
  CREATE_NEWS = 'news.create',
  EDIT_NEWS = 'news.edit',
  DELETE_NEWS = 'news.delete',
  MANAGE_NEWS = 'news.manage',

  // Konten Publik - Announcements
  VIEW_ANNOUNCEMENT = 'announcements.view',
  CREATE_ANNOUNCEMENT = 'announcements.create',
  EDIT_ANNOUNCEMENT = 'announcements.edit',
  DELETE_ANNOUNCEMENT = 'announcements.delete',
  MANAGE_ANNOUNCEMENTS = 'announcements.manage',

  // Konten Publik - Achievements
  VIEW_ACHIEVEMENT = 'achievements.view',
  CREATE_ACHIEVEMENT = 'achievements.create',
  EDIT_ACHIEVEMENT = 'achievements.edit',
  DELETE_ACHIEVEMENT = 'achievements.delete',
  MANAGE_ACHIEVEMENTS = 'achievements.manage',

  // Konten Publik - Galleries
  VIEW_GALLERY = 'galleries.view',
  CREATE_GALLERY = 'galleries.create',
  EDIT_GALLERY = 'galleries.edit',
  DELETE_GALLERY = 'galleries.delete',
  MANAGE_GALLERIES = 'galleries.manage',

  // Konten Publik - Agenda
  VIEW_AGENDA = 'agenda.view',
  CREATE_AGENDA = 'agenda.create',
  EDIT_AGENDA = 'agenda.edit',
  DELETE_AGENDA = 'agenda.delete',
  MANAGE_AGENDA = 'agenda.manage',

  // Media Library
  VIEW_MEDIA = 'media.view',
  UPLOAD_MEDIA = 'media.upload',
  DELETE_MEDIA = 'media.delete',

  // Fasilitas
  VIEW_FACILITY = 'facilities.view',
  CREATE_FACILITY = 'facilities.create',
  EDIT_FACILITY = 'facilities.edit',
  DELETE_FACILITY = 'facilities.delete',
  MANAGE_FACILITY = 'facilities.manage',
  MANAGE_FACILITIES = 'facilities.manage',

  // Data Personel (Guru, Staf, Kepala Sekolah)
  VIEW_PERSONNEL = 'people.view',
  CREATE_PERSONNEL = 'people.create',
  EDIT_PERSONNEL = 'people.edit',
  DELETE_PERSONNEL = 'people.delete',
  MANAGE_PERSONNEL = 'people.manage',

  // Data Sekolah (Profil Sekolah, Visi Misi, Akreditasi, Kontak)
  VIEW_SCHOOL_DATA = 'school_data.view',
  EDIT_SCHOOL_DATA = 'school_data.edit',
  MANAGE_SCHOOL_DATA = 'school_data.edit',

  // Pengaturan Website
  VIEW_SETTINGS = 'website_settings.view',
  EDIT_SETTINGS = 'website_settings.edit',
  BACKUP_RESTORE = 'backup.export',
  EXPORT_BACKUP = 'backup.export',
  IMPORT_BACKUP = 'backup.import',
  RESET_SYSTEM = 'backup.reset',
  SYSTEM_MAINTENANCE = 'website_settings.maintenance',

  // Manajemen Akun & Hak Akses
  VIEW_USERS = 'accounts.view',
  CREATE_USER = 'accounts.create',
  CREATE_USERS = 'accounts.create',
  EDIT_USER = 'accounts.edit',
  EDIT_USERS = 'accounts.edit',
  DELETE_USER = 'accounts.delete',
  DELETE_USERS = 'accounts.delete',
  MANAGE_USERS = 'accounts.manage',
  MANAGE_ROLES = 'roles.manage',
}

export interface RoleInfo {
  role: AdminRole;
  title: string;
  tagline: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  allowedFeatures: string[];
  restrictedFeatures: string[];
}

export const ROLE_DEFINITIONS: Record<AdminRole, RoleInfo> = {
  superadmin: {
    role: 'superadmin',
    title: 'Super Administrator',
    tagline: 'Akses Penuh Sistem & Keamanan',
    description:
      'Memiliki wewenang mutlak atas seluruh fitur CMS, manajemen akun, hak akses role, pengaturan website, konfigurasi keamanan, dan basis data.',
    badgeBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    badgeText: 'text-purple-700 dark:text-purple-300',
    badgeBorder: 'border-purple-500/30',
    allowedFeatures: [
      'Seluruh Konten Publik (Berita, Pengumuman, Prestasi, Galeri)',
      'Data & Personel Sekolah (Guru, Staf, Kepala Sekolah)',
      'Fasilitas Sekolah & Pusat Media',
      'Manajemen Akun & Role Pengelola',
      'Pengaturan Website & Tampilan',
      'Backup, Restore & Reset Sistem',
    ],
    restrictedFeatures: [],
  },
  admin: {
    role: 'admin',
    title: 'Administrator',
    tagline: 'Pengelola Website & Informasi Publik',
    description:
      'Bertanggung jawab atas publikasi informasi sekolah, pengelolaan konten artikel, profil personel, fasilitas, dan pengaturan tampilan umum.',
    badgeBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    badgeText: 'text-blue-700 dark:text-blue-300',
    badgeBorder: 'border-blue-500/30',
    allowedFeatures: [
      'Publikasi Berita, Pengumuman, Prestasi, Galeri & Agenda',
      'Kelola Data Personel (Guru & Staf)',
      'Kelola Data Fasilitas & Media',
      'Pengaturan Tampilan Website & SEO',
      'Export Data Cadangan',
    ],
    restrictedFeatures: [
      'Manajemen Akun Pengguna Lain',
      'Ubah Hak Akses / Role',
      'Import / Reset Database Keseluruhan',
    ],
  },
  operator: {
    role: 'operator',
    title: 'Operator Dapodik / IT',
    tagline: 'Pengelola Data Operasional & Teknis',
    description:
      'Bertanggung jawab atas akurasi data kelembagaan sekolah, sinkronisasi profil guru/staf, fasilitas, media dokumentasi, dan backup data teknis.',
    badgeBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeBorder: 'border-amber-500/30',
    allowedFeatures: [
      'Kelola Profil Lembaga & Data Pokok Sekolah',
      'Kelola Data Personel (Guru, Staf Dapodik)',
      'Kelola Data Sarana & Prasarana (Fasilitas)',
      'Pusat Media & Dokumentasi',
      'Export & Import Data Cadangan Teknis',
    ],
    restrictedFeatures: [
      'Manajemen Akun & Hak Akses',
      'Pengaturan Tampilan & SEO Website',
      'Reset Sistem CMS ke Awal',
    ],
  },
  editor: {
    role: 'editor',
    title: 'Redaksi / Editor Konten',
    tagline: 'Penulis & Pengelola Publikasi Berita',
    description:
      'Khusus mengelola penerbitan berita, artikel kegiatan, pengumuman resmi, catatan prestasi siswa/guru, dan dokumentasi album foto.',
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    badgeBorder: 'border-emerald-500/30',
    allowedFeatures: [
      'Tulis, Edit & Publikasikan Berita & Artikel',
      'Kelola Pengumuman Resmi Sekolah',
      'Pencatatan Prestasi Akademik & Non-Akademik',
      'Upload Album & Foto Galeri Kegiatan',
      'Upload Gambar Pendukung Berita ke Media',
    ],
    restrictedFeatures: [
      'Manajemen Akun & Role Pengelola',
      'Data Identitas Sekolah & Visi Misi',
      'Data Personel Guru & Tata Usaha',
      'Data Fasilitas Sekolah',
      'Pengaturan Website & Backup Data',
    ],
  },
};

const ALL_PERMISSIONS: Permission[] = Object.values(Permission);

export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  superadmin: ALL_PERMISSIONS,

  admin: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_NEWS,
    Permission.CREATE_NEWS,
    Permission.EDIT_NEWS,
    Permission.DELETE_NEWS,
    Permission.MANAGE_NEWS,
    Permission.VIEW_ANNOUNCEMENT,
    Permission.CREATE_ANNOUNCEMENT,
    Permission.EDIT_ANNOUNCEMENT,
    Permission.DELETE_ANNOUNCEMENT,
    Permission.MANAGE_ANNOUNCEMENTS,
    Permission.VIEW_ACHIEVEMENT,
    Permission.CREATE_ACHIEVEMENT,
    Permission.EDIT_ACHIEVEMENT,
    Permission.DELETE_ACHIEVEMENT,
    Permission.MANAGE_ACHIEVEMENTS,
    Permission.VIEW_GALLERY,
    Permission.CREATE_GALLERY,
    Permission.EDIT_GALLERY,
    Permission.DELETE_GALLERY,
    Permission.MANAGE_GALLERIES,
    Permission.VIEW_AGENDA,
    Permission.CREATE_AGENDA,
    Permission.EDIT_AGENDA,
    Permission.DELETE_AGENDA,
    Permission.MANAGE_AGENDA,
    Permission.VIEW_MEDIA,
    Permission.UPLOAD_MEDIA,
    Permission.DELETE_MEDIA,
    Permission.VIEW_FACILITY,
    Permission.CREATE_FACILITY,
    Permission.EDIT_FACILITY,
    Permission.DELETE_FACILITY,
    Permission.MANAGE_FACILITY,
    Permission.MANAGE_FACILITIES,
    Permission.VIEW_PERSONNEL,
    Permission.CREATE_PERSONNEL,
    Permission.EDIT_PERSONNEL,
    Permission.DELETE_PERSONNEL,
    Permission.MANAGE_PERSONNEL,
    Permission.VIEW_SCHOOL_DATA,
    Permission.EDIT_SCHOOL_DATA,
    Permission.MANAGE_SCHOOL_DATA,
    Permission.VIEW_SETTINGS,
    Permission.EDIT_SETTINGS,
    Permission.EXPORT_BACKUP,
    Permission.BACKUP_RESTORE,
    Permission.SYSTEM_MAINTENANCE,
  ],

  operator: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_SCHOOL_DATA,
    Permission.EDIT_SCHOOL_DATA,
    Permission.MANAGE_SCHOOL_DATA,
    Permission.VIEW_PERSONNEL,
    Permission.CREATE_PERSONNEL,
    Permission.EDIT_PERSONNEL,
    Permission.DELETE_PERSONNEL,
    Permission.MANAGE_PERSONNEL,
    Permission.VIEW_FACILITY,
    Permission.CREATE_FACILITY,
    Permission.EDIT_FACILITY,
    Permission.DELETE_FACILITY,
    Permission.MANAGE_FACILITY,
    Permission.MANAGE_FACILITIES,
    Permission.VIEW_MEDIA,
    Permission.UPLOAD_MEDIA,
    Permission.DELETE_MEDIA,
    Permission.VIEW_AGENDA,
    Permission.CREATE_AGENDA,
    Permission.EDIT_AGENDA,
    Permission.DELETE_AGENDA,
    Permission.MANAGE_AGENDA,
    Permission.EXPORT_BACKUP,
    Permission.IMPORT_BACKUP,
    Permission.BACKUP_RESTORE,
    // Read-only for public content
    Permission.VIEW_NEWS,
    Permission.VIEW_ANNOUNCEMENT,
    Permission.VIEW_ACHIEVEMENT,
    Permission.VIEW_GALLERY,
  ],

  editor: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_NEWS,
    Permission.CREATE_NEWS,
    Permission.EDIT_NEWS,
    Permission.DELETE_NEWS,
    Permission.MANAGE_NEWS,
    Permission.VIEW_ANNOUNCEMENT,
    Permission.CREATE_ANNOUNCEMENT,
    Permission.EDIT_ANNOUNCEMENT,
    Permission.DELETE_ANNOUNCEMENT,
    Permission.MANAGE_ANNOUNCEMENTS,
    Permission.VIEW_ACHIEVEMENT,
    Permission.CREATE_ACHIEVEMENT,
    Permission.EDIT_ACHIEVEMENT,
    Permission.DELETE_ACHIEVEMENT,
    Permission.MANAGE_ACHIEVEMENTS,
    Permission.VIEW_GALLERY,
    Permission.CREATE_GALLERY,
    Permission.EDIT_GALLERY,
    Permission.DELETE_GALLERY,
    Permission.MANAGE_GALLERIES,
    Permission.VIEW_AGENDA,
    Permission.CREATE_AGENDA,
    Permission.EDIT_AGENDA,
    Permission.DELETE_AGENDA,
    Permission.VIEW_MEDIA,
    Permission.UPLOAD_MEDIA,
  ],
};

/**
 * Check if a user or role has a specific permission
 */
export function hasPermission(
  userOrRole: AdminUser | AdminRole | string | null | undefined,
  permission: Permission
): boolean {
  if (!userOrRole) return false;
  const role = typeof userOrRole === 'string' ? (userOrRole as AdminRole) : userOrRole.role;
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

/**
 * Check if a user or role has at least one of the specified permissions
 */
export function hasAnyPermission(
  userOrRole: AdminUser | AdminRole | string | null | undefined,
  permissions: Permission[]
): boolean {
  if (!userOrRole) return false;
  return permissions.some((p) => hasPermission(userOrRole, p));
}

/**
 * Check if a user or role has all of the specified permissions
 */
export function hasAllPermissions(
  userOrRole: AdminUser | AdminRole | string | null | undefined,
  permissions: Permission[]
): boolean {
  if (!userOrRole) return false;
  return permissions.every((p) => hasPermission(userOrRole, p));
}

/**
 * Route Permission Mapping
 */
export const ROUTE_PERMISSION_MAP: Record<string, Permission> = {
  '/admin': Permission.VIEW_DASHBOARD,
  '/admin/sekolah': Permission.VIEW_SCHOOL_DATA,
  '/admin/personel': Permission.VIEW_PERSONNEL,
  '/admin/berita': Permission.VIEW_NEWS,
  '/admin/pengumuman': Permission.VIEW_ANNOUNCEMENT,
  '/admin/prestasi': Permission.VIEW_ACHIEVEMENT,
  '/admin/galeri': Permission.VIEW_GALLERY,
  '/admin/fasilitas': Permission.VIEW_FACILITY,
  '/admin/media': Permission.VIEW_MEDIA,
  '/admin/agenda': Permission.VIEW_AGENDA,
  '/admin/news': Permission.VIEW_NEWS,
  '/admin/pengaturan': Permission.VIEW_SETTINGS,
  '/admin/akun': Permission.VIEW_USERS,
};

/**
 * Check if user can access a specific route
 */
export function canAccessRoute(
  userOrRole: AdminUser | AdminRole | string | null | undefined,
  routePath: string
): boolean {
  const cleanPath = routePath.split('?')[0].replace(/\/$/, '');
  const requiredPermission = ROUTE_PERMISSION_MAP[cleanPath];
  if (!requiredPermission) return true;
  return hasPermission(userOrRole, requiredPermission);
}

/**
 * Assert permission and throw error if not authorized (Security First)
 */
export class AccessControlError extends Error {
  public code: string;
  public requiredPermission: Permission;

  constructor(permission: Permission, message?: string) {
    super(message || `Akses ditolak: Operasi membutuhkan izin [${permission}].`);
    this.name = 'AccessControlError';
    this.code = 'PERMISSION_DENIED';
    this.requiredPermission = permission;
  }
}

export function assertPermission(permission: Permission, actionDescription?: string): void {
  const user = getAuthenticatedUser();
  if (!user) {
    throw new AccessControlError(permission, 'Sesi pengguna tidak ditemukan. Silakan login kembali.');
  }
  if (!hasPermission(user, permission)) {
    const action = actionDescription ? `untuk melakukan "${actionDescription}"` : '';
    throw new AccessControlError(
      permission,
      `Akses ditolak! Akun dengan peran "${ROLE_DEFINITIONS[user.role]?.title || user.role}" tidak memiliki izin ${action} [${permission}].`
    );
  }
}

/**
 * React hook to check permissions in components
 */
export function usePermission() {
  const user = getAuthenticatedUser();
  const role = user?.role;
  const roleInfo = role ? ROLE_DEFINITIONS[role] : null;

  return {
    user,
    role,
    roleInfo,
    can: (permission: Permission) => hasPermission(user, permission),
    canAny: (permissions: Permission[]) => hasAnyPermission(user, permissions),
    canAll: (permissions: Permission[]) => hasAllPermissions(user, permissions),
    canRoute: (path: string) => canAccessRoute(user, path),
  };
}
