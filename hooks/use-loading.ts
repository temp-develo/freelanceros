'use client';

import { useState, useCallback } from 'react';

interface UseLoadingOptions {
  initialLoading?: boolean;
  onError?: (error: Error) => void;
}

export function useLoading(options: UseLoadingOptions = {}) {
  const { initialLoading = false, onError } = options;
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<Error | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const setLoadingError = useCallback((error: Error) => {
    setIsLoading(false);
    setError(error);
    if (onError) {
      onError(error);
    }
  }, [onError]);

  const executeAsync = useCallback(async <T>(
    asyncFunction: () => Promise<T>
  ): Promise<T | null> => {
    try {
      startLoading();
      const result = await asyncFunction();
      stopLoading();
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setLoadingError(error);
      return null;
    }
  }, [startLoading, stopLoading, setLoadingError]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setError: setLoadingError,
    executeAsync,
    reset,
  };
}

// Hook for managing multiple loading states
export function useMultipleLoading() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, Error | null>>({});

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
    if (loading) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  }, []);

  const setError = useCallback((key: string, error: Error | null) => {
    setErrors(prev => ({ ...prev, [key]: error }));
    setLoadingStates(prev => ({ ...prev, [key]: false }));
  }, []);

  const executeAsync = useCallback(async <T>(
    key: string,
    asyncFunction: () => Promise<T>
  ): Promise<T | null> => {
    try {
      setLoading(key, true);
      const result = await asyncFunction();
      setLoading(key, false);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(key, error);
      return null;
    }
  }, [setLoading, setError]);

  const isLoading = useCallback((key: string) => loadingStates[key] || false, [loadingStates]);
  const getError = useCallback((key: string) => errors[key] || null, [errors]);
  const isAnyLoading = Object.values(loadingStates).some(Boolean);

  return {
    setLoading,
    setError,
    executeAsync,
    isLoading,
    getError,
    isAnyLoading,
    loadingStates,
    errors,
  };
}