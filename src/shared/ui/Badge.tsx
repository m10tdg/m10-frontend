import React from 'react'

export function Badge({ children, color = 'primary' }: { children: React.ReactNode, color?: 'primary' | 'success' | 'warning' | 'danger' }) {
  // color variants map to Tailwind classes
  const colorClasses = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color] || colorClasses.primary}`}>
      {children}
    </span>
  );
}