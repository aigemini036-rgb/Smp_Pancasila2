import { useEffect, useState } from 'react';

export function useTheme() {
 const [isDark, setIsDark] = useState(false);

 useEffect(() => {
 const stored = localStorage.getItem('theme');
 if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
 setIsDark(true);
 document.documentElement.classList.add('dark');
 }
 }, []);

 const toggleTheme = () => {
 setIsDark(!isDark);
 if (!isDark) {
 document.documentElement.classList.add('dark');
 localStorage.setItem('theme', 'dark');
 } else {
 document.documentElement.classList.remove('dark');
 localStorage.setItem('theme', 'light');
 }
 };

 return { isDark, toggleTheme };
}
