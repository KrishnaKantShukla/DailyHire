'use client';

import React from 'react';

export function HelperAvailabilityToggle({ isAvailable, onToggle }) {
  return (
    <div className="flex items-center gap-3 bg-card border border-border px-4 py-2 rounded-2xl shadow-sm">
      <div className="flex flex-col text-right sm:text-left">
        <span className="text-xs font-medium text-muted-foreground">Duty Status</span>
        <span className={`text-xs font-bold ${isAvailable ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
          {isAvailable ? 'Available for Jobs' : 'Offline'}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onToggle(!isAvailable)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          isAvailable ? 'bg-emerald-500' : 'bg-secondary'
        }`}
        role="switch"
        aria-checked={isAvailable}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isAvailable ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
