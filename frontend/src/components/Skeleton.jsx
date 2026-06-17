import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 glass p-5 shadow-sm space-y-4 font-sans">
      <div className="flex justify-between items-center">
        <div className="h-4 w-24 shimmer rounded" />
        <div className="h-8 w-8 shimmer rounded-full" />
      </div>
      <div className="h-6 w-36 shimmer rounded" />
      <div className="h-4 w-48 shimmer rounded" />
    </div>
  );
};

export const ListSkeleton = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="flex items-center justify-between p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 glass shadow-sm shimmer"
        >
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-xl shimmer bg-slate-200/65 dark:bg-slate-800/65" />
            <div className="space-y-2">
              <div className="h-4 w-32 shimmer rounded" />
              <div className="h-3 w-48 shimmer rounded" />
            </div>
          </div>
          <div className="h-4 w-12 shimmer rounded" />
        </div>
      ))}
    </div>
  );
};

export const ItineraryDetailSkeleton = () => {
  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="h-48 w-full shimmer rounded-3xl" />
      
      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left main content skeleton */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 bg-white dark:bg-slate-900 glass space-y-4">
            <div className="h-6 w-48 shimmer rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full shimmer rounded" />
              <div className="h-4 w-[90%] shimmer rounded" />
              <div className="h-4 w-[85%] shimmer rounded" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 bg-white dark:bg-slate-900 glass space-y-4">
            <div className="h-6 w-56 shimmer rounded" />
            <div className="h-4 w-36 shimmer rounded" />
            <div className="space-y-3 pl-4">
              <div className="h-4 w-[80%] shimmer rounded" />
              <div className="h-4 w-[75%] shimmer rounded" />
              <div className="h-4 w-[85%] shimmer rounded" />
            </div>
          </div>
        </div>

        {/* Right widgets skeleton */}
        <div className="space-y-6">
          <div className="h-48 shimmer rounded-2xl" />
          <div className="h-64 shimmer rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default { CardSkeleton, ListSkeleton, ItineraryDetailSkeleton };
