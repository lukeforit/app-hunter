import { useState, useEffect, useCallback } from 'react';

type ToastType = 'success' | 'error';

interface ToastState {
  message: string;
  type: ToastType;
}

export function useToast(autoDismissMs = 4000) {
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), autoDismissMs);
    return () => clearTimeout(id);
  }, [toast, autoDismissMs]);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return { toast, showToast, hideToast };
}
