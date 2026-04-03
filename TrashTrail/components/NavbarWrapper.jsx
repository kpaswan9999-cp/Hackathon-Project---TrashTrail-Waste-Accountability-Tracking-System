'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

// Only show Navbar on public pages — NOT on role dashboards which have their own Sidebar
const PUBLIC_PATHS = ['/', '/login', '/register'];

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  const isPublicPage = PUBLIC_PATHS.includes(pathname) || 
    pathname.startsWith('/login') || 
    pathname.startsWith('/register');

  if (!isPublicPage) return null;

  return <Navbar />;
}
