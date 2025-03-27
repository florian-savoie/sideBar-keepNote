// /middleware.ts (à la racine du projet, même niveau que package.json)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Récupérer le token d'authentification
  const authToken = request.cookies.get('auth-token');

  // Liste des routes protégées nécessitant une authentification
  const protectedRoutes = ['/liste-favorie', '/dashboard'];

  // Vérifier si l'URL actuelle est une route protégée
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Rediriger vers login si pas de token et route protégée
  if (!authToken && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si l'utilisateur est connecté et essaie d'accéder à la page de login ou signup, rediriger vers le dashboard
  if (authToken && ['/login', '/signup'].some(route =>
    request.nextUrl.pathname.startsWith(route)
  )) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configuration des routes à protéger
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
