'use client';

import { useEffect } from 'react';

export function ErrorSuppressor() {
  useEffect(() => {
    // Suprimir el error de ResizeObserver que es inofensivo
    const resizeObserverError = (e: ErrorEvent) => {
      if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
        e.stopImmediatePropagation();
      }
    };

    window.addEventListener('error', resizeObserverError);

    return () => {
      window.removeEventListener('error', resizeObserverError);
    };
  }, []);

  return null;
}
