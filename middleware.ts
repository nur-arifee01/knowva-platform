import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iewdobuvoauyajpsgsoh.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlld2RvYnV2b2F1eWFqcHNnc29oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5OTA5MTcsImV4cCI6MjEwNTU2NjkxN30.tcCnXyLPKsSIxPyIBCoFGVzB-Z8lHHr1-zOB0DqmvTM';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: '',
          ...options,
        });
      },
    },
  });

  // Refresh session
  const { data: { user } } = await supabase.auth.getUser();

  // Route Protection: /admin and sub-routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 1. If not logged in at all, redirect to home page with auth query
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/';
      redirectUrl.searchParams.set('auth', 'login');
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // 2. Check user's role from profiles table
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const userRole = profile?.role;
      const hasStaffAccess = userRole === 'staff' || userRole === 'admin' || userRole === 'instructor';

      if (!hasStaffAccess) {
        // User is authenticated but does NOT have staff/admin permissions
        const deniedUrl = request.nextUrl.clone();
        deniedUrl.pathname = '/dashboard';
        deniedUrl.searchParams.set('unauthorized', 'admin_access_required');
        return NextResponse.redirect(deniedUrl);
      }
    } catch {
      // In case of network/database failure, allow layout guard to handle it gracefully
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public images)
     */
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};

