"use client";
import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 2600);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 bg-foreground text-background rounded-2xl shadow-2xl font-semibold text-sm flex items-center gap-2.5 ${
        visible ? "toast-enter" : "toast-exit"
      }`}
    >
      <span className="w-6 h-6 rounded-full bg-success flex items-center justify-center shrink-0">
        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </span>
      {message}
    </div>
  );
}