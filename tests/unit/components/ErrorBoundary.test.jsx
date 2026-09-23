import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import { logger } from '@/services/logger.js';

describe('Component: ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with no error in default state', () => {
    const boundary = new ErrorBoundary({});
    expect(boundary.state).toEqual({
      hasError: false,
      error: null,
      errorInfo: null
    });
  });

  it('should update state to hasError: true via getDerivedStateFromError', () => {
    const mockError = new Error('Test crash in child component');
    const newState = ErrorBoundary.getDerivedStateFromError(mockError);
    expect(newState).toEqual({
      hasError: true,
      error: mockError
    });
  });

  it('should report caught exception and component stack trace to telemetry logger', () => {
    const logSpy = vi.spyOn(logger, 'critical').mockImplementation(() => {});
    const boundary = new ErrorBoundary({});
    boundary.setState = vi.fn();

    const mockError = new Error('Database disconnected during render');
    const mockErrorInfo = { componentStack: '\n    in DashboardWeatherTab\n    in Dashboard' };

    boundary.componentDidCatch(mockError, mockErrorInfo);

    expect(boundary.setState).toHaveBeenCalledWith({ errorInfo: mockErrorInfo });
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Database disconnected during render'),
      expect.objectContaining({
        source: 'react_error_boundary',
        stack: mockError.stack,
        componentStack: mockErrorInfo.componentStack
      })
    );
  });

  it('should reset error state when handleReset is triggered', () => {
    const onResetMock = vi.fn();
    const boundary = new ErrorBoundary({ onReset: onResetMock });
    boundary.state = { hasError: true, error: new Error('Err'), errorInfo: {} };

    const setStateSpy = vi.spyOn(boundary, 'setState');
    boundary.handleReset();

    expect(setStateSpy).toHaveBeenCalledWith({
      hasError: false,
      error: null,
      errorInfo: null
    });
    expect(onResetMock).toHaveBeenCalledTimes(1);
  });

  it('should return fallback if provided when hasError is true', () => {
    const customFallback = React.createElement('div', null, 'Custom Error Notice');
    const boundary = new ErrorBoundary({ fallback: customFallback });
    boundary.state = { hasError: true, error: new Error('Crash') };

    const rendered = boundary.render();
    expect(rendered).toBe(customFallback);
  });
});
