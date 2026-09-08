'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCheck, MessageSquare, CreditCard, Calendar, Info, X } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { API_BASE } from '@/lib/api';

export default function NotificationCenter() {
  const { user, isHelper } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const currentUserId = user?._id || user?.id || 'guest';
  const name = user?.firstName ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`.trim() : 'Valued Member';

  const getFallbackNotifications = useCallback(() => {
    if (!user) {
      return [];
    }

    const userName = user?.firstName ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`.trim() : (user?.name || 'Valued Member');

    if (isHelper) {
      return [
        {
          _id: `n_w1_${currentUserId}`,
          title: `Welcome to DailyHire Worker Portal, ${userName}! 🚀`,
          message: 'Your worker account is active. Manage job requests, update your verification details, and track your daily earnings.',
          type: 'system',
          read: false,
          link: '/dashboard',
          createdAt: new Date(),
        },
      ];
    }

    return [
      {
        _id: `n_c1_${currentUserId}`,
        title: `Welcome to DailyHire, ${userName}! 🌟`,
        message: 'Your account is active. Explore 100% ID-verified local daily-wage helpers and manage your service bookings.',
        type: 'system',
        read: false,
        link: '/explore',
        createdAt: new Date(),
      },
    ];
  }, [user, isHelper, currentUserId]);

  const applyLocalReadStatus = useCallback(
    (list) => {
      if (typeof window === 'undefined') return list;
      try {
        const readIds = new Set(JSON.parse(localStorage.getItem(`dailyhire_read_ids_${currentUserId}`) || '[]'));
        const readAllTs = localStorage.getItem(`dailyhire_read_all_${currentUserId}`);
        return list.map((n) => {
          const id = n._id || n.id;
          const isReadById = readIds.has(id);
          const itemTime = new Date(n.createdAt || Date.now()).getTime();
          const isReadByTs = readAllTs && itemTime <= Number(readAllTs);
          if (isReadById || isReadByTs) {
            return { ...n, read: true };
          }
          return n;
        });
      } catch (e) {
        return list;
      }
    },
    [currentUserId]
  );

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    try {
      const base = API_BASE.replace(/\/+$/, '');
      const res = await fetch(`${base}/api/notifications/${currentUserId}`);
      const data = await res.json();
      let rawList = [];
      if (data.success && Array.isArray(data.notifications) && data.notifications.length > 0) {
        rawList = data.notifications;
      } else {
        rawList = getFallbackNotifications();
      }
      setNotifications(applyLocalReadStatus(rawList));
    } catch (err) {
      setNotifications(applyLocalReadStatus(getFallbackNotifications()));
    }
  }, [user, currentUserId, getFallbackNotifications, applyLocalReadStatus]);

  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(fetchNotifications, 10000);
    return () => clearInterval(timer);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (typeof window !== 'undefined') {
      try {
        const readIds = new Set(JSON.parse(localStorage.getItem(`dailyhire_read_ids_${currentUserId}`) || '[]'));
        notifications.forEach((n) => readIds.add(n._id || n.id));
        localStorage.setItem(`dailyhire_read_ids_${currentUserId}`, JSON.stringify(Array.from(readIds)));
        localStorage.setItem(`dailyhire_read_all_${currentUserId}`, Date.now().toString());
      } catch (e) {}
    }
    try {
      const base = API_BASE.replace(/\/+$/, '');
      await fetch(`${base}/api/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId }),
      });
    } catch (e) {}
  };

  const getIcon = (type) => {
    switch (type) {
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case 'booking':
        return <Calendar className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-muted text-foreground transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-background animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-3.5 border-b border-border bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-foreground text-sm">Notifications</h4>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-primary/15 text-primary font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Read all
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-xs">No new notifications</div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n._id || n.id}
                  href={n.link || '#'}
                  onClick={() => setOpen(false)}
                  className={`p-3.5 flex items-start gap-3 transition-colors text-xs block ${
                    !n.read ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/40'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-muted shrink-0 mt-0.5">{getIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-xs truncate">{n.title}</p>
                    <p className="text-muted-foreground text-xs mt-0.5 leading-snug">{n.message}</p>
                    <span className="text-[10px] text-muted-foreground/70 mt-1 block">
                      {new Date(n.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
