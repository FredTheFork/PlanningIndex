'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  retryFn?: () => void;
  dismissed: boolean;
}

const MAX_VISIBLE = 4;

export function useAdminToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const showToast = useCallback((params: {
    message: string;
    type: ToastType;
    duration?: number;
    retryFn?: () => void;
  }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const duration = params.duration ?? 5000;
    const toast: Toast = {
      id,
      message: params.message,
      type: params.type,
      duration,
      retryFn: params.retryFn,
      dismissed: false,
    };

    setToasts((prev) => {
      const next = [...prev, toast];
      if (next.length > MAX_VISIBLE) {
        const removed = next.shift();
        if (removed) {
          const timer = timersRef.current.get(removed.id);
          if (timer) {
            clearTimeout(timer);
            timersRef.current.delete(removed.id);
          }
        }
      }
      return next;
    });

    const timer = setTimeout(() => {
      dismissToast(id);
    }, duration);
    timersRef.current.set(id, timer);

    return id;
  }, [dismissToast]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  return { toasts, showToast, dismissToast };
}
