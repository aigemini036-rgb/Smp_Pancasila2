import React, { useState } from 'react';
import { getSchoolSettings } from '../../utils/storage';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import EditorialUnderlineHeading from '../../components/public/EditorialUnderlineHeading';
import AnimatedMapRoute from '../../components/public/AnimatedMapRoute';

export default function Kontak() {
  const settings = getSchoolSettings();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
      {/* Editorial Header */}
      <EditorialUnderlineHeading
        badge="Hubungi Kami"
        badgeIcon={Phone}
        title="Layanan Kontak & Pendaftaran"
        subtitle="Punya pertanyaan seputar PPDB, konsultasi pendidikan, atau kunjungan sekolah? Tim kami siap melayani Anda."
      />

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Contact Information */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-white">SMP PANCASILA</h2>
            <p className="text-xs text-yellow-500 font-semibold uppercase tracking-wider mt-1">
              PONOKAWAN — KRIAN — SIDOARJO
            </p>
          </div>

          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <MapPin className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">Alamat Lengkap</p>
                <p className="text-xs text-slate-400 mt-0.5">{settings.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <Phone className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">Telepon / WhatsApp PPDB</p>
                <p className="text-xs text-slate-400 mt-0.5">{settings.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <Mail className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">Email Resmi Sekretariat</p>
                <p className="text-xs text-slate-400 mt-0.5">{settings.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <Clock className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">Jam Operasional Layanan</p>
                <p className="text-xs text-slate-400 mt-0.5">{settings.operating_hours}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Message */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Kirim Pesan / Pertanyaan
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Formulir komunikasi langsung ke bagian sekretariat SMP Pancasila Ponokawan.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/40 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-yellow-600 mx-auto" />
              <h3 className="font-bold text-slate-900 dark:text-white">Pesan Terkirim!</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Terima kasih. Pesan Anda telah kami terima dan akan dibalas secepatnya.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nama Anda"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor WhatsApp / Telp *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subjek Pesan / Pertanyaan
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Contoh: Info Syarat PPDB 2026/2027"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Isi Pesan *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tuliskan pertanyaan atau pesan Anda secara rinci di sini..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pesan Sekarang</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Interactive Animated Route Map */}
      <AnimatedMapRoute
        address={settings.address}
        phone={settings.phone}
      />
    </div>
  );
}

