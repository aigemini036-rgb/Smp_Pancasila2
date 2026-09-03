export type CategoryPerson = 'kepala_sekolah' | 'guru' | 'staff';
export type PersonStatus = 'active' | 'inactive';
export type ContentStatus = 'draft' | 'published';
export type AnnouncementStatus = 'active' | 'inactive';
export type AchievementLevel = 'sekolah' | 'individu';

export type AdminRole = 'superadmin' | 'admin' | 'editor' | 'operator';

export interface SchoolSettings {
  id: string;
  school_name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  vision: string;
  mission: string;
  history: string;
  operating_hours: string;
  npsn?: string;
  accreditation?: string;
  accreditation_label?: string;
  total_students?: string;
  stat_students_label?: string;
  total_teachers?: string;
  stat_teachers_label?: string;
  total_achievements?: string;
  stat_achievements_label?: string;
  social_links: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
  contact_other?: string;
  updated_at: string;
  // Website Customization & Meta Settings
  headmaster_section_background?: string;
  headmaster_background_position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  headmaster_background_opacity?: number;
  website_title?: string;
  website_tagline?: string;
  meta_description?: string;
  meta_keywords?: string;
  banner_announcement_enabled?: boolean;
  banner_announcement_text?: string;
  banner_announcement_link?: string;
  whatsapp_number?: string;
  whatsapp_chat_widget_enabled?: boolean;
  google_maps_embed?: string;
  footer_copyright?: string;
  maintenance_mode?: boolean;
}

export interface Person {
  id: string;
  name: string;
  slug: string;
  photo: string;
  position: string;
  category: CategoryPerson;
  nip_nuptk?: string;
  education: string;
  subject?: string;
  education_history: string;
  work_history: string;
  short_bio: string;
  contact?: string;
  achievements_note?: string;
  status: PersonStatus;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  content: string;
  author_id: string;
  author_name: string;
  category: string;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
  published_at: string;
}

export interface Announcement {
  id: string;
  slug: string;
  title: string;
  content: string;
  status: AnnouncementStatus;
  start_date: string;
  end_date?: string;
  attachment_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: AchievementLevel;
  recipient_name?: string;
  recipient_id?: string;
  year: number;
  documentation: string;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface Gallery {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  gallery_id: string;
  image: string;
  caption?: string;
  date?: string;
  status: 'published' | 'hidden';
  created_at: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  photo?: string;
  image?: string;
  location?: string;
  condition?: string;
  specifications?: string;
  status: ContentStatus;
  published?: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediaFile {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  alt_text?: string;
  uploaded_by: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  password?: string;
  role: AdminRole;
  avatar?: string;
  phone?: string;
  linked_person_id?: string;
  status: 'active' | 'inactive';
  last_login?: string;
  created_at: string;
  updated_at: string;
}
