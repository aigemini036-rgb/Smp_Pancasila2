import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { getPeople, getAchievements } from '../../utils/storage';
import HangingHeadmasterPhoto from '../../components/public/HangingHeadmasterPhoto';
import {
  User,
  GraduationCap,
  Briefcase,
  Mail,
  Award,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Crown,
} from 'lucide-react';

export default function PersonelDetail() {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const shouldReduceMotion = useReducedMotion();
  const people = getPeople();
  const target = slug || id;
  const person = people.find((p) => p.slug === target || p.id === target);

  // Scroll to top when personnel profile opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [person?.id]);

  if (!person) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <User className="w-16 h-16 text-slate-400 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Profil Personel Tidak Ditemukan
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Data personel yang Anda cari mungkin telah diperbarui atau dihapus.
        </p>
        <Link
          to="/personel"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500 text-slate-950 font-bold text-xs shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Direktori Personel</span>
        </Link>
      </div>
    );
  }

  // Related Achievements for this person
  const achievements = getAchievements().filter(
    (ac) =>
      ac.recipient_id === person.id ||
      ac.recipient_name?.toLowerCase().includes(person.name.toLowerCase())
  );

  const backUrl =
    person.category === 'kepala_sekolah'
      ? '/personel/kepala-sekolah'
      : person.category === 'guru'
      ? '/personel/guru'
      : '/personel/staff';

  const backLabel =
    person.category === 'kepala_sekolah'
      ? 'Daftar Kepala Sekolah'
      : person.category === 'guru'
      ? 'Daftar Dewan Guru'
      : 'Daftar Staff & TU';

  const isHead = person.category === 'kepala_sekolah';

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.28,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8"
    >
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link
          to={backUrl}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke {backLabel}</span>
        </Link>

        <Link
          to="/personel"
          className="text-xs font-medium text-slate-400 hover:underline"
        >
          Semua Personel
        </Link>
      </div>

      {/* Main Profile Header Card */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.24,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6"
      >
        <div className="relative shrink-0 pt-2">
          {isHead ? (
            <HangingHeadmasterPhoto
              src={person.photo}
              alt={person.name}
              className="w-36 h-44 sm:w-44 sm:h-52 rounded-2xl object-cover border-4 border-yellow-500/20 shadow-md"
              badge={
                <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-yellow-500 text-slate-950 flex items-center justify-center shadow-lg z-30">
                  <Crown className="w-4 h-4" />
                </div>
              }
            />
          ) : (
            <div className="relative group/photo overflow-hidden rounded-2xl border-4 border-yellow-500/20 hover:border-yellow-500/50 hover:ring-2 hover:ring-yellow-500/20 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
              <img
                src={person.photo}
                alt={person.name}
                className="w-36 h-44 sm:w-44 sm:h-52 rounded-2xl object-cover transition-all duration-300 ease-out group-hover/photo:scale-[1.025] group-hover/photo:-translate-y-0.5"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-yellow-500/[0.04] to-white/10 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          )}
        </div>

        <div className="space-y-3 text-center sm:text-left flex-1 min-w-0">
          <div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 ${
                isHead
                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                  : person.category === 'guru'
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {person.category === 'kepala_sekolah'
                ? 'Kepala Sekolah'
                : person.category === 'guru'
                ? 'Dewan Guru'
                : 'Staff & Tata Usaha'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {person.name}
            </h1>
            <p className="text-sm sm:text-base text-yellow-600 dark:text-yellow-500 font-bold mt-1">
              {person.position}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-700">
            {person.nip_nuptk && (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                <span className="text-slate-400 block font-bold text-[10px] uppercase">NIP / NUPTK</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{person.nip_nuptk}</span>
              </div>
            )}
            {person.subject && (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Mata Pelajaran</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{person.subject}</span>
              </div>
            )}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60">
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Pendidikan Terakhir</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{person.education || '-'}</span>
            </div>
            {person.contact && (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Kontak / Email</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-yellow-500" />
                  {person.contact}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Bio / Ringkasan Profile */}
      {person.short_bio && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.24,
            delay: shouldReduceMotion ? 0 : 0.04,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
        >
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-yellow-500" />
            <span>Biografi & Catatan Pengabdian</span>
          </h3>
          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {person.short_bio}
          </p>
        </motion.div>
      )}

      {/* History Grid */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.24,
          delay: shouldReduceMotion ? 0 : 0.08,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="grid md:grid-cols-2 gap-6"
      >
        {/* Education History */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-yellow-500" />
            <span>Riwayat Pendidikan</span>
          </h3>
          <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {person.education_history ? (
              person.education_history.split('|').map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700/60">
                  <CheckCircle2 className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                  <span>{item.trim()}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 italic">Belum ada catatan riwayat pendidikan tambahan.</p>
            )}
          </div>
        </div>

        {/* Work History */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-yellow-500" />
            <span>Riwayat Pekerjaan & Jabatan</span>
          </h3>
          <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {person.work_history ? (
              person.work_history.split('|').map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700/60">
                  <CheckCircle2 className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                  <span>{item.trim()}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 italic">Belum ada catatan riwayat pekerjaan tambahan.</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Achievements Note */}
      {achievements.length > 0 && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.24,
            delay: shouldReduceMotion ? 0 : 0.12,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md space-y-4"
        >
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span>Prestasi & Bimbingan Terkait</span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {achievements.map((item) => (
              <div
                key={item.id}
                className="group p-4 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-yellow-500/50 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-lg hover:shadow-black/40 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] space-y-1 cursor-pointer"
              >
                <span className="text-[10px] font-bold text-yellow-400 group-hover:text-yellow-300 uppercase transition-colors">
                  Tahun {item.year} • {item.category}
                </span>
                <h4 className="font-bold text-sm text-white group-hover:text-yellow-400 transition-colors leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
