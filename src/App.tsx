import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import NewsManager from './pages/admin/NewsManager';
import AgendaManager from './pages/admin/AgendaManager';

export default function App() {
 return (
 <BrowserRouter>
 <Routes>
 <Route path="/" element={<LandingPage />} />
 
 {/* Admin Routes */}
 <Route path="/admin" element={<AdminLayout />}>
 <Route index element={<Dashboard />} />
 <Route path="news" element={<NewsManager />} />
          <Route path="agenda" element={<AgendaManager />} />
 <Route path="settings" element={<div className="p-8"><h1 className="text-2xl font-bold ">Pengaturan (Segera Hadir)</h1></div>} />
 </Route>
 </Routes>
 </BrowserRouter>
 );
}

