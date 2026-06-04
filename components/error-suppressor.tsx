'use client';

import { useEffect } from 'react';

// Suprimir inmediatamente a nivel global antes de cualquier código React
if (typeof window !== 'undefined') {
  // Interceptar window.onerror
  const originalOnError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    if (message && String(message).includes('ResizeObserver')) {
      return true;
    }
    if (originalOnError) {
      return originalOnError.call(this, message, source, lineno, colno, error);
    }
    return false;
  };

  // Interceptar errores del event loop
  const errorHandler = (e: ErrorEvent) => {
    if (e.message && e.message.includes('ResizeObserver')) {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
    }
  };
  window.addEventListener('error', errorHandler, true);

  // Interceptar console.error globalmente
  const originalConsoleError = console.error;
  console.error = function(...args) {
    const msg = args[0];
    if (
      (typeof msg === 'string' && msg.includes('ResizeObserver')) ||
      (msg instanceof Error && msg.message && msg.message.includes('ResizeObserver')) ||
      (args.some(arg => typeof arg === 'string' && arg.includes('ResizeObserver')))
    ) {
      return;
    }
    return originalConsoleError.apply(console, args);
  };
}

export function ErrorSuppressor() {
  useEffect(() => {
    // Reforzar la supresión después del montaje de React
    const handler = (e: ErrorEvent) => {
      if (e.message && e.message.includes('ResizeObserver')) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
      }
    };

    const rejectionHandler = (e: PromiseRejectionEvent) => {
      const reason = e.reason;
      if (reason && ((typeof reason === 'string' && reason.includes('ResizeObserver')) ||
          (reason.message && reason.message.includes('ResizeObserver')))) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };

    window.addEventListener('error', handler, true);
    window.addEventListener('unhandledrejection', rejectionHandler, true);

    return () => {
      window.removeEventListener('error', handler, true);
      window.removeEventListener('unhandledrejection', rejectionHandler, true);
    };
  }, []);

  return null;
}
