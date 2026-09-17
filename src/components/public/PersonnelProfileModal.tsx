import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Person } from '../../types';
import { getAchievements } from '../../utils/storage';
import {
  X,
  GraduationCap,
  Briefcase,
  Mail,
  Award,
  BookOpen,
  Crown,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export interface PersonnelProfileModalProps {
  person: Person | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * PersonnelProfileModal
 *
 * Implements 6. PERSONNEL PROFILE TRANSITION (Modal Reveal mode):
 * - Smooth fade, slide, and subtle scale reveal (scale: 0.98 -> 1, y: 16 -> 0)
 * - Quick & clear timing (0.24s duration, ease [0.16, 1, 0.3, 1])
 * - Free from giant zoom, 3D rotation, or dramatic morph
 * - Instantly usable after animation with full contact, bio, and achievements details
 * - Full accessibility with ESC key and backdrop close
 */
export default function PersonnelProfileModal({
  person,
  isOpen,
  onClose,
}: PersonnelProfileModalProps) {
  const shouldReduceMotion = useReducedMotion();

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!person) return null;

  const isHead = person.category === 'kepala_sekolah';
  const isTeacher = person.category === 'guru';

  // Fetch relevant achievements for this personnel
  const achievements = getAchievements().filter(
    (ac) =>
      ac.recipient_id === person.id ||
      ac.recipient_name?.toLowerCase().includes(person.name.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop with fade transition */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Container with Fade, Slide, and Subtle Scale Reveal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="personnel-modal-title"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 16, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 12, scale: 0.98 }
            }
            transition={{
              duration: shouldReduceMotion ? 0 : 0.24,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col"
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/75 dark:bg-slate-900/75 backdrop-blur-xs">
              <span
                className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 ${
                  isHead
                    ? 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30'
                    : isTeacher
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {isHead && <Crown className="w-3 h-3" />}
                {isTeacher && <GraduationCap className="w-3 h-3" />}
                {!isHead && !isTeacher && <Briefcase className="w-3 h-3" />}
                <span>
                  {isHead
                    ? 'Kepala Sekolah'
                    : isTeacher
                    ? 'Dewan Guru Pengajar'
                    : 'Staff & Tata Usaha'}
                </span>
              </span>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-hidden focus:ring-2 focus:ring-yellow-500"
                aria-label="Tutup modal profil"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {/* Profile Head */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                {/* Portrait with subtle hover feedback */}
                <div className="group/photo relative shrink-0 w-28 h-36 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-md hover:border-yellow-500/40 hover:ring-2 hover:ring-yellow-500/20 transition-all duration-300">
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="w-full h-full object-cover transition-all duration-300 ease-out group-hover/photo:scale-[1.025] group-hover/photo:-translate-y-0.5"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-yellow-500/[0.04] to-white/10 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <h2
                    id="personnel-modal-title"
                    className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight"
                  >
                    {person.name}
                  </h2>
                  <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                    {person.position}
                  </p>
                  {person.nip_nuptk && (
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      NIP/NUPTK: {person.nip_nuptk}
                    </p>
                  )}

                  <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium inline-flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-yellow-500" />
                      <span>{person.education || 'Sarjana Pendidikan'}</span>
                    </span>
                    {person.subject && (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium inline-flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-yellow-500" />
                        <span>{person.subject}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio / Ringkasan Singkat */}
              {person.short_bio && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-4 border-l-yellow-500">
                  "{person.short_bio}"
                </div>
              )}

              {/* Credentials & Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {person.contact && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Kontak / Email
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-yellow-500" />
                      <span>{person.contact}</span>
                    </span>
                  </div>
                )}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Status Keaktifan
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Aktif Bertugas di SMP Pancasila</span>
                  </span>
                </div>
              </div>

              {/* Achievements (if any) */}
              {achievements.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-yellow-500" />
                    <span>Prestasi & Bimbingan Terkait</span>
                  </h3>
                  <div className="space-y-2">
                    {achievements.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/60 text-xs"
                      >
                        <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400 uppercase">
                          Tahun {item.year} • {item.category}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white mt-0.5">
                          {item.title}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/75 shrink-0 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Tutup
              </button>

              <Link
                to={`/personel/${person.slug || person.id}`}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <span>Halaman Profil Lengkap</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
