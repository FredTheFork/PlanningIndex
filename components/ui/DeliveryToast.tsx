'use client';

import { useEffect, useState, useCallback } from 'react';
import { FileText, Globe, Share2, X, CheckCircle2 } from 'lucide-react';
import { useDeliveryNotifications, DeliveryNotification } from '@/hooks/useDeliveryNotifications';

interface ToastState {
  notification: DeliveryNotification;
  timestamp: Date;
}

const TOAST_DURATION = 8000;
const MAX_TOASTS = 3;

export function DeliveryToast() {
  const { notifications, unreadCount, markAsRead } = useDeliveryNotifications();
  const [activeToasts, setActiveToasts] = useState<ToastState[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // Find new (unread, not dismissed) notifications to show as toasts
  useEffect(() => {
    const newNotifications = notifications.filter(n => !n.read && !dismissed.has(n.id));
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const recentUnread = newNotifications.filter(n => {
      const timestamp = new Date(n.timestamp);
      return timestamp > fiveMinutesAgo;
    });

    // Add new toasts (limit to MAX_TOASTS)
    recentUnread.slice(0, MAX_TOASTS).forEach(notification => {
      if (!activeToasts.some(t => t.notification.id === notification.id)) {
        setActiveToasts(prev => [...prev, { notification, timestamp: now }]);
      }
    });
  }, [notifications, dismissed, activeToasts]);

  // Auto-dismiss toasts after duration
  useEffect(() => {
    const timers = activeToasts.map(toast => {
      return setTimeout(() => {
        dismissToast(toast.notification.id);
      }, TOAST_DURATION);
    });

    return () => timers.forEach(clearTimeout);
  }, [activeToasts]);

  const dismissToast = useCallback((id: string) => {
    setDismissed(prev => new Set([...prev, id]));
    setActiveToasts(prev => prev.filter(t => t.notification.id !== id));
    markAsRead(id);
  }, [markAsRead]);

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
      {activeToasts.map((toast) => (
        <ToastCard
          key={toast.notification.id}
          notification={toast.notification}
          onDismiss={() => dismissToast(toast.notification.id)}
        />
      ))}
    </div>
  );
}

function ToastCard({
  notification,
  onDismiss,
}: {
  notification: DeliveryNotification;
  onDismiss: () => void;
}) {
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(onDismiss, 200);
  };

  const Icon = notification.type === 'document'
    ? FileText
    : notification.type === 'website'
    ? Globe
    : Share2;

  const bgColor = notification.type === 'document'
    ? 'bg-[#1B3F7A]'
    : notification.type === 'website'
    ? 'bg-[#2C68C4]'
    : 'bg-[#F59E0B]';

  return (
    <div
      className={`
        relative flex items-start gap-3 p-4 rounded-lg shadow-lg
        ${bgColor} text-white
        transform transition-all duration-200
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
        animate-slide-in-right
      `}
    >
      <div className="bg-white/20 rounded-lg p-1.5 shrink-0">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0 pr-6">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 size={14} className="text-white/80" />
          <p className="font-inter font-semibold text-sm">{notification.title}</p>
        </div>
        <p className="font-inter text-xs text-white/90">{notification.message}</p>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 text-white/60 hover:text-white transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function DeliveryNotificationBadge({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-green-500 rounded-full animate-pulse-subtle">
      {count > 9 ? '9+' : count}
    </span>
  );
}
