import React from 'react';
import { Compass, Award, Star, Code2, Calendar, ShieldCheck } from 'lucide-react';
import { AnalyzedProfile } from '../types';

interface ProfileSummaryBannerProps {
  profile: AnalyzedProfile;
}

export const ProfileSummaryBanner: React.FC<ProfileSummaryBannerProps> = ({ profile }) => {
  const { personaTitle, summaryParagraph, totalStars, topLanguage, accountAgeYears, mostStarredRepo } = profile;

  return (
    <div className="bg-gradient-to-br from-[#1a0828] via-[#280a34] to-[#12041c] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-heliotrope/30">
      {/* Soft Ambient Inner Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-razzmatazz/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-60 h-60 bg-malachite/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 border border-white/20 rounded-2xl text-heliotrope backdrop-blur-md shadow-sm">
              <Compass className="w-5 h-5 text-heliotrope" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-semibold tracking-wider text-heliotrope">
                Developer Overview
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {personaTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-white/90 backdrop-blur-md">
            <Award className="w-3.5 h-3.5 text-malachite" />
            <span>Profile Archetype</span>
          </div>
        </div>

        {/* Paragraph summary */}
        <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 backdrop-blur-md">
          {summaryParagraph}
        </p>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-2.5 backdrop-blur-md">
            <Star className="w-4 h-4 text-heliotrope shrink-0" />
            <div>
              <p className="text-[10px] text-white/60 font-medium">Total Stars</p>
              <p className="text-sm font-semibold text-white">{totalStars.toLocaleString()}</p>
            </div>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-2.5 backdrop-blur-md">
            <Code2 className="w-4 h-4 text-malachite shrink-0" />
            <div>
              <p className="text-[10px] text-white/60 font-medium">Top Language</p>
              <p className="text-sm font-semibold text-white truncate max-w-[100px]">{topLanguage}</p>
            </div>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-2.5 backdrop-blur-md">
            <Calendar className="w-4 h-4 text-razzmatazz shrink-0" />
            <div>
              <p className="text-[10px] text-white/60 font-medium">Account Age</p>
              <p className="text-sm font-semibold text-white">{accountAgeYears} Years</p>
            </div>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-2.5 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-malachite shrink-0" />
            <div>
              <p className="text-[10px] text-white/60 font-medium">Top Repository</p>
              <p className="text-sm font-semibold text-white truncate max-w-[100px]">
                {mostStarredRepo ? mostStarredRepo.name : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
