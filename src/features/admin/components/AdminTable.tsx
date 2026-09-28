'use client';

import React from 'react';

interface AdminTableProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

export function AdminTable({ children, className = '' }: AdminTableProps) {
  return (
    <div className={`overflow-x-auto rounded-2xl border border-border bg-card shadow-xs ${className}`}>
      <table className="w-full text-left text-xs sm:text-sm text-foreground">{children}</table>
    </div>
  );
}
