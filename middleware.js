import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// JWT verify function using jose (Edge Runtime compatible)
async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isProtectedPage = pathname.startsWith('/chat');

  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && token) {
    const decoded = await verifyToken(token);
    if (decoded) {
      return NextResponse.redirect(new URL('/chat', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/chat/:path*', '/login', '/register'],
};
