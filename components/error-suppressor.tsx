'use client';

import { useEffect } from 'react';

// Suprimir inmediatamente antes de que React se monte
if (typeof window !== 'undefined') {
  const originalError = window.onerror;
  window.onerror = (message, ...args) => {
    if (message && typeof message === 'string' && message.includes('ResizeObserver')) {
      return true;
    }
    return originalError ? originalError(message, ...args) : false;
  };
}

export function ErrorSuppressor() {
  useEffect(() => {
    // Suprimir el error de ResizeObserver que es inofensivo
    const resizeObserverErrorHandler = (e: ErrorEvent) => {
      if (e.message && e.message.includes('ResizeObserver')) {
        e.stopImmediatePropagation();
        e.preventDefault();
        return;
      }
    };

    // Capturar errores con capture phase para interceptar antes
    window.addEventListener('error', resizeObserverErrorHandler, true);
    
    // Sobrescribir console.error para filtrar este mensaje específico
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args[0];
      if (
        (typeof message === 'string' && message.includes('ResizeObserver')) ||
        (message instanceof Error && message.message.includes('ResizeObserver'))
      ) {
        return;
      }
      originalConsoleError.apply(console, args);
    };

    // Capturar unhandledrejection también
    const unhandledRejectionHandler = (e: PromiseRejectionEvent) => {
      if (e.reason && e.reason.message && e.reason.message.includes('ResizeObserver')) {
        e.preventDefault();
      }
    };
    window.addEventListener('unhandledrejection', unhandledRejectionHandler);

    return () => {
      window.removeEventListener('error', resizeObserverErrorHandler, true);
      window.removeEventListener('unhandledrejection', unhandledRejectionHandler);
      console.error = originalConsoleError;
    };
  }, []);

  return null;
}
