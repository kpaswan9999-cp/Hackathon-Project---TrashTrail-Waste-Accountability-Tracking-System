import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    if (pathname.startsWith('/citizen') && token?.role !== 'citizen') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (pathname.startsWith('/collector') && token?.role !== 'collector') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/citizen/:path*', '/collector/:path*', '/admin/:path*'],
};
