import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="glass-panel rounded-3xl p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-2xl bg-[#1d0b36]" />
            <div className="space-y-3">
              <div className="w-48 h-8 bg-[#1d0b36] rounded-lg" />
              <div className="w-32 h-4 bg-[#1d0b36] rounded-lg" />
              <div className="w-64 h-4 bg-[#1d0b36] rounded-lg" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-24 h-12 bg-[#1d0b36] rounded-xl" />
            <div className="w-24 h-12 bg-[#1d0b36] rounded-xl" />
          </div>
        </div>
      </div>

      {/* Summary Banner Skeleton */}
      <div className="glass-panel rounded-3xl p-8 space-y-4">
        <div className="w-64 h-6 bg-[#1d0b36] rounded-lg" />
        <div className="w-full h-16 bg-[#1d0b36] rounded-xl" />
        <div className="grid grid-cols-4 gap-3">
          <div className="h-12 bg-[#1d0b36] rounded-xl" />
          <div className="h-12 bg-[#1d0b36] rounded-xl" />
          <div className="h-12 bg-[#1d0b36] rounded-xl" />
          <div className="h-12 bg-[#1d0b36] rounded-xl" />
        </div>
      </div>

      {/* Cards Skeleton Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-36 glass-card rounded-2xl p-5 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#1d0b36]" />
            <div className="w-3/4 h-5 rounded-md bg-[#1d0b36]" />
            <div className="w-full h-4 rounded-md bg-[#1d0b36]" />
          </div>
        ))}
      </div>
    </div>
  );
};
