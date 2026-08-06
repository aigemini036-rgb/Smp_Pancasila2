import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Newspaper, Calendar, Settings, LogOut, GraduationCap, ArrowLeft } from 'lucide-react';

export default function AdminLayout() {
 const navItems = [
 { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
 { name: 'Kelola Berita', path: '/admin/news', icon: Newspaper },
    { name: 'Kelola Agenda', path: '/admin/agenda', icon: Calendar },
 { name: 'Pengaturan', path: '/admin/settings', icon: Settings },
 ];

 return (
 <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row">
 {/* Sidebar */}
 <aside className="w-full md:w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0">
 <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
 <div className="flex items-center gap-2">
 <GraduationCap className="w-8 h-8 text-yellow-600 " />
 <span className="text-xl font-bold text-slate-900 dark:text-white ">AdminHub</span>
 </div>
 </div>
 
 <nav className="flex-1 p-4 space-y-1">
 {navItems.map((item) => (
 <NavLink
 key={item.name}
 to={item.path}
 end={item.end}
 className={({ isActive }) =>
 `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
 isActive
 ? 'bg-blue-50 text-yellow-600 '
 : 'text-slate-900 dark:text-white hover:bg-slate-50 dark:bg-slate-900'
 }`
 }
 >
 <item.icon className="w-5 h-5" />
 {item.name}
 </NavLink>
 ))}
 </nav>
 
 <div className="p-4 border-t border-slate-200 dark:border-slate-700 ">
 <NavLink
 to="/"
 className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:bg-slate-900 transition-colors mb-2"
 >
 <ArrowLeft className="w-5 h-5" />
 Kembali ke Web
 </NavLink>
 <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-900 dark:text-white hover:bg-blue-50 transition-colors">
 <LogOut className="w-5 h-5" />
 Keluar
 </button>
 </div>
 </aside>

 {/* Main Content */}
 <main className="flex-1 overflow-x-hidden overflow-y-auto">
 <Outlet />
 </main>
 </div>
 );
}
