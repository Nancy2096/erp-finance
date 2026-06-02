'use client';

import { useEffect } from 'react';

export function ErrorSuppressor() {
  useEffect(() => {
    // Suprimir el error de ResizeObserver que es inofensivo
    const resizeObserverErrorHandler = (e: ErrorEvent) => {
      if (e.message && e.message.includes('ResizeObserver loop')) {
        e.stopImmediatePropagation();
        e.preventDefault();
        return true;
      }
    };

    // Capturar errores en window.error
    window.addEventListener('error', resizeObserverErrorHandler);
    
    // Sobrescribir console.error para filtrar este mensaje específico
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('ResizeObserver loop')) {
        return;
      }
      originalConsoleError.apply(console, args);
    };

    // También capturar a nivel global con window.onerror
    const originalOnError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      if (message && typeof message === 'string' && message.includes('ResizeObserver loop')) {
        return true;
      }
      if (originalOnError) {
        return originalOnError(message, source, lineno, colno, error);
      }
      return false;
    };

    return () => {
      window.removeEventListener('error', resizeObserverErrorHandler);
      console.error = originalConsoleError;
      window.onerror = originalOnError;
    };
  }, []);

  return null;
}
