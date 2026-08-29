import React from 'react';
import { Star, GitFork, Code2, Award, Zap, Calendar, TrendingUp } from 'lucide-react';
import { AnalyzedProfile } from '../types';

interface RepoStatsCardProps {
  profile: AnalyzedProfile;
}

export const RepoStatsCard: React.FC<RepoStatsCardProps> = ({ profile }) => {
  const { insights } = profile;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-forest dark:text-cream tracking-tight flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-malachite" />
          <span>Key Developer Metrics</span>
        </h3>
        <span className="text-xs font-medium text-forest/60 dark:text-cream/60">
          Calculated from public GitHub data
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="glass-card rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2 bg-[#1a0a2c]/80 rounded-xl transition-transform inline-block border border-heliotrope/20">
                  {insight.emoji}
                </span>
                <span className="text-[10px] uppercase font-semibold text-malachite bg-malachite/10 border border-malachite/30 px-2.5 py-1 rounded-full">
                  {insight.type.replace('_', ' ')}
                </span>
              </div>

              <h4 className="font-bold text-forest dark:text-cream text-base tracking-tight">
                {insight.title}
              </h4>
              <p className="text-xs text-forest/80 dark:text-cream/80 leading-relaxed font-normal">
                {insight.text}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-heliotrope/15 flex items-center justify-between text-[11px] text-forest/60 dark:text-cream/60 font-medium">
              <span>GitHub Activity</span>
              <span className="text-heliotrope">Active Metric</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
