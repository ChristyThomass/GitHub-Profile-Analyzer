import React from 'react';
import {
  MapPin,
  Building,
  Link as LinkIcon,
  Twitter,
  Calendar,
  Users,
  BookOpen,
  Code2,
  ExternalLink,
  Share2,
  Sparkles,
  Award,
} from 'lucide-react';
import { AnalyzedProfile } from '../types';

interface ProfileHeaderProps {
  profile: AnalyzedProfile;
  onOpenShareModal: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, onOpenShareModal }) => {
  const { user, createdDateFormatted, accountAgeYears, personaTitle } = profile;

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all">
      {/* Background Subtle Gradient Ambient Glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-gradient-to-br from-moss/25 via-ochre/25 to-terracotta/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        {/* Left: Avatar + User Details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative group">
            <img
              src={user.avatar_url}
              alt={`${user.login}'s avatar`}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-cream/80 dark:ring-forest/80 shadow-lg group-hover:scale-105 transition-all duration-300"
            />
            <div className="absolute -bottom-2 -right-2 p-1.5 bg-terracotta text-cream rounded-xl shadow-md text-xs border border-cream/40" title={personaTitle}>
              <Award className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1.5 min-w-0 max-w-full">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <h2 className="text-xl sm:text-3xl font-black text-forest dark:text-cream tracking-tight break-words min-w-0">
                {user.name || user.login}
              </h2>
              <a
                href={user.html_url}
                target="_blank"
                rel="noreferrer"
                className="text-forest/50 hover:text-terracotta dark:hover:text-ochre transition-colors shrink-0"
                title="Open GitHub Profile"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
              <span className="text-forest/70 dark:text-cream/70 font-mono">@{user.login}</span>
              <span className="text-forest/30 dark:text-cream/30">•</span>
              <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-moss/10 text-moss dark:text-ochre border border-moss/20 dark:border-ochre/30 flex items-center gap-1.5 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-ochre" />
                {personaTitle}
              </span>
            </div>

            {user.bio && (
              <p className="text-sm text-forest/90 dark:text-cream/90 max-w-xl leading-relaxed pt-1 font-normal">
                {user.bio}
              </p>
            )}

            {/* Meta tags (Location, Company, Join Date, Website) */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-forest/70 dark:text-cream/70 pt-2 font-medium">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-moss" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.company && (
                <div className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-terracotta" />
                  <span>{user.company}</span>
                </div>
              )}
              {user.blog && (
                <a
                  href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-terracotta dark:hover:text-ochre transition-colors underline decoration-forest/30 dark:decoration-cream/30 underline-offset-2"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-ochre" />
                  <span className="truncate max-w-[180px]">{user.blog.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
              {user.twitter_username && (
                <a
                  href={`https://twitter.com/${user.twitter_username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-terracotta transition-colors"
                >
                  <Twitter className="w-3.5 h-3.5 text-ochre" />
                  <span>@{user.twitter_username}</span>
                </a>
              )}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFAB00]/10 border border-[#FFAB00]/30 text-[#FFAB00] font-bold text-xs">
                <Calendar className="w-3.5 h-3.5 text-[#FFAB00]" />
                <span>Account Started: {createdDateFormatted} ({accountAgeYears}y ago)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions + Quick Stat Pills */}
        <div className="flex flex-col sm:items-end gap-3 w-full md:w-auto">
          <button
            onClick={onOpenShareModal}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#fff2e6] hover:bg-[#ffe3d1] text-[#7a1a00] font-bold text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#ffccb3]"
          >
            <Share2 className="w-4 h-4 text-[#7a1a00]" />
            <span>Generate Wrapped Card</span>
          </button>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-2 w-full sm:w-auto pt-2 sm:pt-0">
            <div className="px-3 py-2 glass-pill rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1 text-forest/70 dark:text-cream/70 text-xs mb-0.5 font-medium">
                <Users className="w-3 h-3 text-malachite" />
                <span>Followers</span>
              </div>
              <span className="font-extrabold text-forest dark:text-cream text-base">
                {user.followers.toLocaleString()}
              </span>
            </div>

            <div className="px-3 py-2 glass-pill rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1 text-forest/70 dark:text-cream/70 text-xs mb-0.5 font-medium">
                <Users className="w-3 h-3 text-razzmatazz" />
                <span>Following</span>
              </div>
              <span className="font-extrabold text-forest dark:text-cream text-base">
                {user.following.toLocaleString()}
              </span>
            </div>

            <div className="px-3 py-2 glass-pill rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1 text-forest/70 dark:text-cream/70 text-xs mb-0.5 font-medium">
                <BookOpen className="w-3 h-3 text-heliotrope" />
                <span>Public Repos</span>
              </div>
              <span className="font-extrabold text-forest dark:text-cream text-base">
                {user.public_repos.toLocaleString()}
              </span>
            </div>

            <div className="px-3 py-2 glass-pill rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1 text-forest/70 dark:text-cream/70 text-xs mb-0.5 font-medium">
                <Code2 className="w-3 h-3 text-malachite" />
                <span>Public Gists</span>
              </div>
              <span className="font-extrabold text-forest dark:text-cream text-base">
                {user.public_gists.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
