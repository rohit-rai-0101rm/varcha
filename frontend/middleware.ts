import { NextRequest, NextResponse } from 'next/server';

// Flip to false + push to reopen the site. Hardcoded (not env-driven) so a
// single push closes/reopens it everywhere it's deployed, no per-host env config needed.
const SITE_CLOSED = true;

export function middleware(request: NextRequest) {
  if (SITE_CLOSED && request.nextUrl.pathname !== '/site-closed') {
    const url = request.nextUrl.clone();
    url.pathname = '/site-closed';
    return NextResponse.rewrite(url);
  }

  const response = NextResponse.next();

  if (!request.cookies.get('varcha_session')) {
    const sessionId = crypto.randomUUID();
    response.cookies.set('varcha_session', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      httpOnly: false,
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
