import { Users, BookOpen, Trophy, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { getNews, getAgenda } from '../../utils/storage';
import { useEffect, useState } from 'react';

function StatCard({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) {
 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
 >
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">{title}</p>
 <h3 className="text-3xl font-bold text-slate-900 dark:text-white ">{value}</h3>
 </div>
 <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
 <Icon className="w-6 h-6" />
 </div>
 </div>
 </motion.div>
 );
}

export default function Dashboard() {
 const [newsCount, setNewsCount] = useState(0);
  const [agendaCount, setAgendaCount] = useState(0);

 useEffect(() => {
 setNewsCount(getNews().length);
    setAgendaCount(getAgenda().length);
 }, []);

 return (
 <div className="p-6 md:p-8">
 <div className="mb-8">
 <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Dashboard</h1>
 <p className="text-slate-900 dark:text-white ">Selamat datang di Panel Admin SchoolHub.</p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
 <StatCard title="Total Siswa" value="1,200+" icon={Users} color="bg-blue-50 text-yellow-600 " />
 <StatCard title="Total Jurusan" value="8" icon={BookOpen} color="bg-blue-50 text-yellow-600 " />
 <StatCard title="Total Agenda" value={agendaCount} icon={Trophy} color="bg-blue-50 text-yellow-600 " />
 <StatCard title="Total Berita" value={newsCount} icon={FileText} color="bg-blue-50 text-yellow-600 " />
 </div>

 <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
 <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Aktivitas Terbaru</h2>
 <div className="text-center py-10">
 <p className="text-slate-900 dark:text-white ">Belum ada aktivitas terbaru yang tercatat hari ini.</p>
 </div>
 </div>
 </div>
 );
}
