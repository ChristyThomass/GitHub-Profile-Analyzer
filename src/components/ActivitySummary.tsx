import React from 'react';
import { Activity, Clock, GitFork, ShieldCheck, Sparkles, BarChart2 } from 'lucide-react';
import { AnalyzedProfile } from '../types';

interface ActivitySummaryProps {
  profile: AnalyzedProfile;
}

export const ActivitySummary: React.FC<ActivitySummaryProps> = ({ profile }) => {
  const {
    accountAgeYears,
    accountAgeMonths,
    createdDateFormatted,
    recentActivityCount,
    recentActivityPercentage,
    repos,
    nonForkCount,
    forkCount,
    avgStarsPerRepo,
    avgForksPerRepo,
  } = profile;

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#FFAB00]" />
          <h3 className="text-xl font-bold text-forest dark:text-cream tracking-tight">
            Activity & Maintenance Metrics
          </h3>
        </div>
        <span className="text-xs font-semibold text-forest/50 dark:text-cream/50 uppercase tracking-wider">
          Longevity & Ratio
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Account Longevity & Activity Meter */}
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FFAB00]" />
              <h4 className="font-bold text-forest dark:text-cream text-sm">Account Tenure & Update Recency</h4>
            </div>
            <span className="text-xs font-bold text-[#FFAB00] font-mono">
              {accountAgeYears}y {accountAgeMonths}m
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-forest/80 dark:text-cream/80">
              <span>Updated within last 12 months</span>
              <span className="font-bold text-forest dark:text-cream">
                {recentActivityCount} of {repos.length} repos ({recentActivityPercentage}%)
              </span>
            </div>
            <div className="w-full h-3 bg-[#140803]/80 rounded-full overflow-hidden p-0.5 border border-[#FFAB00]/20">
              <div
                className="h-full bg-gradient-to-r from-[#FFAB00] to-[#DD2E18] rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${recentActivityPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 glass-pill rounded-xl">
              <span className="text-forest/60 dark:text-cream/60 block text-[10px]">Account Started Date</span>
              <span className="font-bold text-forest dark:text-cream">{createdDateFormatted}</span>
            </div>
            <div className="p-3 glass-pill rounded-xl">
              <span className="text-forest/60 dark:text-cream/60 block text-[10px]">Activity Status</span>
              <span className="font-bold text-[#FFAB00]">
                {recentActivityPercentage >= 50 ? '🔥 Highly Active' : '🌱 Moderate Maintainer'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Original Code vs Forks Ratio */}
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-[#DD2E18]" />
              <h4 className="font-bold text-forest dark:text-cream text-sm">Original Code vs Forked Repos</h4>
            </div>
            <span className="text-xs font-bold text-[#DD2E18] font-mono">
              {repos.length} Repos
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-forest/80 dark:text-cream/80">
              <span>Original Repositories</span>
              <span className="font-bold text-forest dark:text-cream">
                {nonForkCount} original / {forkCount} forked
              </span>
            </div>
            <div className="w-full h-3 bg-[#140803]/80 rounded-full overflow-hidden flex p-0.5 border border-[#FFAB00]/20">
              <div
                className="h-full bg-gradient-to-r from-[#FFAB00] to-[#DD2E18] rounded-full transition-all duration-500"
                style={{ width: `${repos.length > 0 ? (nonForkCount / repos.length) * 100 : 100}%` }}
                title={`Original: ${nonForkCount}`}
              />
              <div
                className="h-full bg-[#DD2E18]/70 rounded-full transition-all duration-500"
                style={{ width: `${repos.length > 0 ? (forkCount / repos.length) * 100 : 0}%` }}
                title={`Forked: ${forkCount}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 glass-pill rounded-xl">
              <span className="text-forest/60 dark:text-cream/60 block text-[10px]">Avg Stars / Repo</span>
              <span className="font-bold text-forest dark:text-cream">⭐ {avgStarsPerRepo}</span>
            </div>
            <div className="p-3 glass-pill rounded-xl">
              <span className="text-forest/60 dark:text-cream/60 block text-[10px]">Avg Forks / Repo</span>
              <span className="font-bold text-forest dark:text-cream flex items-center gap-1 mt-0.5">
                <GitFork className="w-3.5 h-3.5 text-[#FFAB00]" />
                <span>{avgForksPerRepo}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
