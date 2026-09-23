import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createUnifiedNotFoundHandler, unifiedErrorHandler } from '../src/middleware/unifiedRouteHandler.js';

test('MIDDLEWARE: 404 browser navigation redirects gracefully to /login', () => {
  const handler = createUnifiedNotFoundHandler('/dummy/dist');
  let redirectedTo = null;
  let statusCode = null;

  const req = {
    method: 'GET',
    path: '/unknown-advisory-page',
    originalUrl: '/unknown-advisory-page',
    headers: { accept: 'text/html,application/xhtml+xml' },
    accepts: (type) => type === 'html',
    xhr: false
  };

  const res = {
    redirect: (status, url) => {
      statusCode = status;
      redirectedTo = url;
    }
  };

  handler(req, res);

  assert.equal(statusCode, 302);
  assert.equal(redirectedTo, '/login');
});

test('MIDDLEWARE: 404 API request returns uniform JSON redirect instructions and Location header', () => {
  const handler = createUnifiedNotFoundHandler('/dummy/dist');
  let responseStatus = null;
  let responseJson = null;
  const headers = {};

  const req = {
    method: 'GET',
    path: '/api/unknown-endpoint',
    originalUrl: '/api/unknown-endpoint',
    headers: { accept: 'application/json' },
    accepts: (type) => false,
    xhr: false
  };

  const res = {
    set: (key, val) => { headers[key] = val; },
    status: (code) => {
      responseStatus = code;
      return {
        json: (data) => { responseJson = data; }
      };
    }
  };

  handler(req, res);

  assert.equal(responseStatus, 404);
  assert.equal(responseJson.redirect, '/login');
  assert.equal(headers['Location'], '/login');
  assert.equal(headers['X-Redirect-To'], '/login');
});

test('MIDDLEWARE: 404 loop guard prevents redirect loop when request is already /login', () => {
  const handler = createUnifiedNotFoundHandler('/dummy/dist');
  let calledSend = false;
  let redirected = false;

  const req = {
    method: 'GET',
    path: '/login',
    originalUrl: '/login',
    headers: { accept: 'text/html' },
    accepts: (type) => true,
    xhr: false
  };

  const res = {
    redirect: () => { redirected = true; },
    status: (code) => ({
      send: () => { calledSend = true; }
    }),
    sendFile: () => { calledSend = true; }
  };

  handler(req, res);

  assert.equal(redirected, false, 'Must never redirect to /login when already at /login');
  assert.equal(calledSend, true);
});

test('MIDDLEWARE: Unhandled 500 error gracefully redirects browser navigation to /login?error=server_error', () => {
  let redirectedTo = null;
  let statusCode = null;

  const req = {
    method: 'GET',
    path: '/broken-view',
    originalUrl: '/broken-view',
    headers: { accept: 'text/html' },
    accepts: (type) => type === 'html',
    xhr: false
  };

  const res = {
    redirect: (status, url) => {
      statusCode = status;
      redirectedTo = url;
    }
  };

  const error = new Error('Database connection failed');
  unifiedErrorHandler(error, req, res, () => {});

  assert.equal(statusCode, 302);
  assert.equal(redirectedTo, '/login?error=server_error');
});

test('MIDDLEWARE: Unhandled 500 error on API request returns uniform JSON and Location: /login', () => {
  let responseStatus = null;
  let responseJson = null;
  const headers = {};

  const req = {
    method: 'POST',
    path: '/api/faulty-call',
    originalUrl: '/api/faulty-call',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    accepts: () => false,
    xhr: false
  };

  const res = {
    set: (key, val) => { headers[key] = val; },
    status: (code) => {
      responseStatus = code;
      return {
        json: (data) => { responseJson = data; }
      };
    }
  };

  const error = new Error('Calculations failed');
  unifiedErrorHandler(error, req, res, () => {});

  assert.equal(responseStatus, 500);
  assert.equal(responseJson.redirect, '/login');
  assert.equal(headers['Location'], '/login');
});

test('MIDDLEWARE: Unhandled error loop guard prevents redirect loop when error happens on /login', () => {
  let responseStatus = null;
  let redirected = false;

  const req = {
    method: 'GET',
    path: '/login',
    originalUrl: '/login',
    headers: { accept: 'text/html' },
    accepts: () => true,
    xhr: false
  };

  const res = {
    redirect: () => { redirected = true; },
    status: (code) => {
      responseStatus = code;
      return {
        json: () => {}
      };
    }
  };

  const error = new Error('Login template compilation error');
  unifiedErrorHandler(error, req, res, () => {});

  assert.equal(redirected, false, 'Must not redirect /login error back to /login');
  assert.equal(responseStatus, 500);
});
