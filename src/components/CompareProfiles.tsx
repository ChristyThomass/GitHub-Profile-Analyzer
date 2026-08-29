import React from 'react';
import { Scale, Trophy, Star, GitFork, Users, BookOpen, Clock, Activity, CheckCircle2 } from 'lucide-react';
import { ComparisonData } from '../types';

interface CompareProfilesProps {
  comparisonData: ComparisonData;
}

export const CompareProfiles: React.FC<CompareProfilesProps> = ({ comparisonData }) => {
  const { profile1, profile2, metrics, verdict } = comparisonData;

  return (
    <div className="space-y-8">
      {/* Verdict Banner */}
      <div className="bg-gradient-to-r from-[#1e0e07] via-[#2a1308] to-[#140803] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#FFAB00]/30 space-y-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-[#FFAB00]" />
          <h3 className="text-xl sm:text-2xl font-bold">Comparison Summary</h3>
        </div>
        <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal">
          {verdict}
        </p>
      </div>

      {/* Side-by-Side User Headers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User 1 Card */}
        <div className="glass-panel rounded-3xl p-6 border-2 border-[#FFAB00]/50 shadow-2xl space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={profile1.user.avatar_url}
              alt={profile1.user.login}
              className="w-16 h-16 rounded-2xl ring-4 ring-[#FFAB00]/40 object-cover shadow-md"
            />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#FFAB00] bg-[#FFAB00]/10 border border-[#FFAB00]/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                Developer #1
              </span>
              <h4 className="font-extrabold text-forest dark:text-cream text-xl mt-1">
                {profile1.user.name || profile1.user.login}
              </h4>
              <p className="text-xs text-forest/60 dark:text-cream/60 font-mono">@{profile1.user.login}</p>
            </div>
          </div>
          <div className="p-3 glass-pill rounded-xl text-xs space-y-1">
            <span className="text-forest/60 dark:text-cream/60 font-medium block">Persona:</span>
            <span className="font-bold text-forest dark:text-cream">{profile1.personaTitle}</span>
          </div>
        </div>

        {/* User 2 Card */}
        <div className="glass-panel rounded-3xl p-6 border-2 border-[#DD2E18]/50 shadow-2xl space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={profile2.user.avatar_url}
              alt={profile2.user.login}
              className="w-16 h-16 rounded-2xl ring-4 ring-[#DD2E18]/40 object-cover shadow-md"
            />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#DD2E18] bg-[#DD2E18]/10 border border-[#DD2E18]/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                Developer #2
              </span>
              <h4 className="font-extrabold text-forest dark:text-cream text-xl mt-1">
                {profile2.user.name || profile2.user.login}
              </h4>
              <p className="text-xs text-forest/60 dark:text-cream/60 font-mono">@{profile2.user.login}</p>
            </div>
          </div>
          <div className="p-3 glass-pill rounded-xl text-xs space-y-1">
            <span className="text-forest/60 dark:text-cream/60 font-medium block">Persona:</span>
            <span className="font-bold text-forest dark:text-cream">{profile2.personaTitle}</span>
          </div>
        </div>
      </div>

      {/* Head-to-Head Comparative Metrics Table */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-heliotrope" />
          <h3 className="text-xl font-bold text-forest dark:text-cream tracking-tight">
            Head-to-Head Metrics Breakdown
          </h3>
        </div>

        <div className="space-y-4">
          {metrics.map((metric) => {
            const val1Num = typeof metric.user1Val === 'number' ? metric.user1Val : parseFloat(metric.user1Val as string) || 0;
            const val2Num = typeof metric.user2Val === 'number' ? metric.user2Val : parseFloat(metric.user2Val as string) || 0;
            const maxVal = Math.max(val1Num, val2Num) || 1;

            const width1 = Math.max(8, Math.round((val1Num / maxVal) * 100));
            const width2 = Math.max(8, Math.round((val2Num / maxVal) * 100));

            return (
              <div
                key={metric.label}
                className="p-4 rounded-2xl glass-card space-y-2"
              >
                <div className="flex justify-between items-center text-xs font-bold text-forest dark:text-cream">
                  <span className="flex items-center gap-1.5">
                    {metric.winner === 1 && <Trophy className="w-3.5 h-3.5 text-[#FFAB00] inline" />}
                    <span className={metric.winner === 1 ? 'text-[#FFAB00] font-black' : ''}>
                      {metric.user1Val}
                    </span>
                  </span>

                  <span className="uppercase tracking-wider text-[11px] text-forest/60 dark:text-cream/60 font-semibold">
                    {metric.label}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <span className={metric.winner === 2 ? 'text-[#DD2E18] font-black' : ''}>
                      {metric.user2Val}
                    </span>
                    {metric.winner === 2 && <Trophy className="w-3.5 h-3.5 text-[#DD2E18] inline" />}
                  </span>
                </div>

                {/* Comparative Horizontal Bar Visualizer */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {/* Left user bar */}
                  <div className="h-2 bg-[#140803]/80 rounded-full overflow-hidden flex justify-end">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        metric.winner === 1 ? 'bg-[#FFAB00]' : 'bg-[#FFAB00]/40'
                      }`}
                      style={{ width: `${width1}%` }}
                    />
                  </div>

                  {/* Right user bar */}
                  <div className="h-2 bg-[#140803]/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        metric.winner === 2 ? 'bg-[#DD2E18]' : 'bg-[#DD2E18]/40'
                      }`}
                      style={{ width: `${width2}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
