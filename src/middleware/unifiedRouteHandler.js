/**
 * Unified Express Server-Side Middleware for 404 and Unhandled Routing Errors
 * 
 * Intercepts:
 * 1. 404 Not Found routes across both API endpoints and frontend navigation paths.
 * 2. Unhandled server-side exceptions and routing errors (500s).
 * 
 * Guarantees:
 * - Redirects gracefully to the sign-in page (/login) for browser navigation.
 * - Uniformly provides structured redirect signals ({ redirect: '/login' }, Location header) for API clients.
 * - Strict infinite loop guards (prevents redirecting to /login when already processing /login).
 */
import path from 'node:path';
import fs from 'node:fs';

/**
 * Checks whether a request should be treated as an API/JSON request or browser navigation.
 */
function isApiOrJsonRequest(req) {
  // If explicitly targeted at /api
  if (req.path.startsWith('/api')) {
    // If a browser explicitly requested HTML from address bar, treat as browser navigation
    if (req.accepts('html') && !req.xhr && !req.headers.accept?.includes('application/json')) {
      return false;
    }
    return true;
  }
  // If XHR / fetch or JSON Content-Type / Accept header
  if (req.xhr) return true;
  if (req.headers['content-type']?.includes('application/json')) return true;
  if (req.headers.accept?.includes('application/json') && !req.headers.accept?.includes('text/html')) return true;
  
  return false;
}

/**
 * Unified 404 Not Found Middleware
 * Catches all unmapped API routes, missing static resources, and unhandled paths.
 */
export function createUnifiedNotFoundHandler(frontendDist) {
  return function unifiedNotFoundHandler(req, res) {
    // INFINITE LOOP GUARD: If the request is already for /login, do NOT redirect to /login
    if (req.path === '/login') {
      if (frontendDist && fs.existsSync(path.join(frontendDist, 'index.html'))) {
        return res.sendFile(path.join(frontendDist, 'index.html'));
      }
      return res.status(200).send('<!-- KrishiMitraaz Login Portal -->');
    }

    const isApi = isApiOrJsonRequest(req);

    console.warn(`[route-guard] 404 unhandled route intercepted: ${req.method} ${req.originalUrl} (isApi=${isApi}) -> redirecting to /login`);

    if (isApi) {
      // Uniform JSON response with redirect guidance for API / programmatic clients
      res.set('Location', '/login');
      res.set('X-Redirect-To', '/login');
      return res.status(404).json({
        ok: false,
        error: 'Route Not Found',
        message: `The requested endpoint '${req.originalUrl}' does not exist. Redirecting to login.`,
        redirect: '/login',
        status: 404,
        timestamp: new Date().toISOString()
      });
    }

    // Uniform browser redirect to /login for frontend navigation and document requests
    return res.redirect(302, '/login');
  };
}

/**
 * Unified Unhandled Error Middleware (500)
 * Intercepts uncaught exceptions and routing errors, redirecting gracefully to /login.
 */
export function unifiedErrorHandler(err, req, res, _next) {
  console.error(`[route-guard] Unhandled routing error at ${req.method} ${req.originalUrl}:`, err);

  // INFINITE LOOP GUARD: If error occurred while loading /login, do NOT redirect to /login
  if (req.path === '/login') {
    return res.status(500).json({
      ok: false,
      error: 'Authentication Portal Error',
      message: err.message || 'Error loading authentication service.'
    });
  }

  const isApi = isApiOrJsonRequest(req);

  if (isApi) {
    res.set('Location', '/login');
    res.set('X-Redirect-To', '/login');
    return res.status(err.status || 500).json({
      ok: false,
      error: 'Internal Server Error',
      message: err.message || 'An unexpected routing error occurred.',
      redirect: '/login',
      status: err.status || 500
    });
  }

  // Gracefully redirect browser navigation to /login with error context
  return res.redirect(302, '/login?error=server_error');
}
