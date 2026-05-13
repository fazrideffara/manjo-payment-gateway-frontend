import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function StatusBadge({ status }) {
  const statusLower = status?.toLowerCase();
  
  const variants = {
    success: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    failed: "bg-red-100 text-red-700 border-red-200",
    cancelled: "bg-red-50 text-red-600 border-red-100",
    canceled: "bg-red-50 text-red-600 border-red-100",
    expired: "bg-slate-100 text-slate-500 border-slate-200",
  };

  const style = variants[statusLower] || variants.pending;

  return (
    <span className={twMerge(
      "px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border shadow-sm transition-all uppercase",
      style
    )}>
      {status}
    </span>
  );
}
