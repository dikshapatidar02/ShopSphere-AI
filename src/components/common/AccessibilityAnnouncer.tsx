'use client';

import { useEffect, useState } from 'react';

interface AnnouncementEvent {
  message: string;
  timestamp: number;
}

let announceListeners: Array<(message: string) => void> = [];

export function announceToScreenReader(message: string): void {
  announceListeners.forEach((listener) => listener(message));
}

export function AccessibilityAnnouncer() {
  const [announcements, setAnnouncements] = useState<AnnouncementEvent[]>([]);

  useEffect(() => {
    const handleAnnounce = (msg: string) => {
      setAnnouncements((prev) => [
        ...prev.slice(-4), // keep last 5 messages
        { message: msg, timestamp: Date.now() },
      ]);
    };

    announceListeners.push(handleAnnounce);
    return () => {
      announceListeners = announceListeners.filter((l) => l !== handleAnnounce);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      aria-relevant="additions text"
      className="sr-only"
      aria-label="Screen reader announcements"
    >
      {announcements.map((item) => (
        <p key={item.timestamp}>{item.message}</p>
      ))}
    </div>
  );
}
