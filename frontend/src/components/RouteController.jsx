import { Navigate, useLocation, Outlet } from 'react-router-dom';

/**
 * RouteController - Unified Route Controller & Fallback Manager
 * 
 * Handles:
 * 1. Unauthorized access prevention: Redirects unauthorized users attempting
 *    to access protected application views to the sign-in page (/login).
 * 2. Missing route & invalid URL fallbacks: Catches broken, unmapped, or
 *    unrecognized URLs and redirects to the sign-in page (for unauthenticated users)
 *    or the main dashboard (for authenticated users).
 * 3. Infinite recursive redirect loop prevention:
 *    - Checks current location to never redirect to /login when already at /login.
 *    - Checks current location to never redirect to /dashboard when already at /dashboard.
 *    - Always specifies `replace: true` on navigations to avoid history pollution.
 */

// Helper to reliably check authentication across component lifecycles
export function isUserAuthenticated(token) {
  if (token) return true;
  try {
    const stored = localStorage.getItem('krishimitraaz_token');
    return Boolean(stored && stored.trim().length > 0);
  } catch {
    return false;
  }
}

/**
 * ProtectedRoute: Wraps portal views requiring authentication.
 * If unauthorized, immediately redirects to /login without looping.
 */
export function ProtectedRoute({ token, children }) {
  const location = useLocation();
  const authenticated = isUserAuthenticated(token);

  if (!authenticated) {
    // Guard against recursive loop if already on login path
    if (location.pathname === '/login') {
      return children || <Outlet />;
    }
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  return children || <Outlet />;
}

/**
 * MissingRouteFallback: Unified controller for all missing, invalid, or unmapped URLs (*).
 * - Unauthorized users: redirected cleanly to /login.
 * - Authorized users: redirected cleanly to /dashboard.
 * - Recursive loop guard: completely suppresses redirection if target matches current path.
 */
export function MissingRouteFallback({ token }) {
  const location = useLocation();
  const authenticated = isUserAuthenticated(token);

  // LOOP GUARD 1: If already at /login, do NOT navigate to /login
  if (location.pathname === '/login') {
    return null;
  }

  // Unauthorized attempt or invalid URL when not signed in -> redirect to sign-in page
  if (!authenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // LOOP GUARD 2: If already at /dashboard, do NOT navigate to /dashboard
  if (location.pathname === '/dashboard') {
    return null;
  }

  // Authorized user accessing invalid URL -> return to dashboard
  return <Navigate to="/dashboard" replace />;
}

export default function RouteController({ token, mode = 'fallback', children }) {
  if (mode === 'protect') {
    return <ProtectedRoute token={token}>{children}</ProtectedRoute>;
  }
  return <MissingRouteFallback token={token} />;
}
