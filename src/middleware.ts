
import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['en', 'ka'];
const defaultLocale = 'en';

/**
 * Safely determines the best locale based on the request headers.
 */
function getLocale(request: NextRequest): string {
  try {
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    // Negotiator returns an array of preferred languages.
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
    
    // Filter out any invalid or wildcard characters that might confuse the matcher
    const cleanLanguages = languages.filter(lang => lang && lang !== '*' && /^[a-zA-Z0-9-]{2,10}$/.test(lang));

    // If no valid languages are found, return the default locale
    if (cleanLanguages.length === 0) {
      return defaultLocale;
    }

    // Attempt to match the cleaned languages with our supported locales
    return match(cleanLanguages, locales, defaultLocale);
  } catch (error) {
    // If anything fails during matching, always fall back to the default locale
    return defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check if the pathname is missing a locale prefix
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 2. Redirect if the locale prefix is missing
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    
    // Build the new URL with the detected (or fallback) locale
    const newUrl = new URL(
      `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
      request.url
    );
    
    // Use a temporary redirect to avoid caching issues during development
    return NextResponse.redirect(newUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  // We want to skip internal Next.js paths, static assets, and images
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|placeholder-images.json).*)'],
};
