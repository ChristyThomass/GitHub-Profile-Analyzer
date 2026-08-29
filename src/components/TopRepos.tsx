import React, { useState } from 'react';
import { Star, GitFork, ExternalLink, Flame, Search, ArrowUpDown, Code2, ShieldAlert } from 'lucide-react';
import { AnalyzedProfile, GitHubRepo } from '../types';
import { getLanguageColor } from '../utils/languageColors';

interface TopReposProps {
  profile: AnalyzedProfile;
}

export const TopRepos: React.FC<TopReposProps> = ({ profile }) => {
  const { repos, mostStarredRepo } = profile;
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'stars' | 'forks' | 'updated'>('stars');
  const [displayCount, setDisplayCount] = useState(5);

  if (!repos || repos.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-2">
        <p className="text-slate-500 font-medium">No public repositories found for this user.</p>
      </div>
    );
  }

  // Filter & Sort Repos
  const filteredRepos = repos.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      (r.language && r.language.toLowerCase().includes(q))
    );
  });

  const sortedRepos = [...filteredRepos].sort((a, b) => {
    if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
    if (sortBy === 'forks') return b.forks_count - a.forks_count;
    if (sortBy === 'updated') {
      return new Date(b.pushed_at || b.updated_at).getTime() - new Date(a.pushed_at || a.updated_at).getTime();
    }
    return 0;
  });

  const visibleRepos = sortedRepos.slice(0, displayCount);

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 transition-colors">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-forest dark:text-cream tracking-tight flex items-center gap-2">
            <Flame className="w-5 h-5 text-ochre" />
            <span>Top Public Repositories</span>
          </h3>
          <p className="text-xs text-forest/70 dark:text-cream/70 mt-1">
            Showing top repositories out of <strong>{repos.length}</strong> total projects
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-moss" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repos..."
              className="pl-9 pr-3 py-1.5 text-xs glass-input rounded-xl text-forest dark:text-cream placeholder:text-forest/40 dark:placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-moss w-full sm:w-48"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-1 bg-[#22120a]/80 p-1 rounded-2xl border border-[#ffccb3]/30 text-xs font-medium backdrop-blur-md overflow-x-auto max-w-full">
            <button
              onClick={() => setSortBy('stars')}
              className={`flex-1 sm:flex-none px-3 py-1 rounded-xl transition-all cursor-pointer ${
                sortBy === 'stars'
                  ? 'bg-[#fff2e6] text-[#7a1a00] shadow-xs font-bold backdrop-blur-md border border-[#ffccb3]'
                  : 'text-cream/70 hover:text-white'
              }`}
            >
              ⭐ Stars
            </button>
            <button
              onClick={() => setSortBy('forks')}
              className={`flex-1 sm:flex-none px-3 py-1 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                sortBy === 'forks'
                  ? 'bg-[#fff2e6] text-[#7a1a00] shadow-xs font-bold backdrop-blur-md border border-[#ffccb3]'
                  : 'text-cream/70 hover:text-white'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Forks</span>
            </button>
            <button
              onClick={() => setSortBy('updated')}
              className={`flex-1 sm:flex-none px-3 py-1 rounded-xl transition-all cursor-pointer ${
                sortBy === 'updated'
                  ? 'bg-[#fff2e6] text-[#7a1a00] shadow-xs font-bold backdrop-blur-md border border-[#ffccb3]'
                  : 'text-cream/70 hover:text-white'
              }`}
            >
              📅 Updated
            </button>
          </div>
        </div>
      </div>

      {/* Repos Cards List */}
      <div className="space-y-4">
        {visibleRepos.map((repo, idx) => {
          const isFlagship = mostStarredRepo && repo.id === mostStarredRepo.id && repo.stargazers_count > 0;
          const langColor = getLanguageColor(repo.language);
          const updatedDate = new Date(repo.pushed_at || repo.updated_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <div
              key={repo.id}
              className={`p-5 rounded-2xl transition-all hover:border-malachite/50 dark:hover:border-heliotrope/60 hover:shadow-xl space-y-3 relative group backdrop-blur-md ${
                isFlagship
                  ? 'bg-gradient-to-r from-razzmatazz/20 via-heliotrope/20 to-transparent border-2 border-razzmatazz/80 dark:border-razzmatazz/70 shadow-lg'
                  : 'glass-card'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-forest dark:text-cream text-base hover:text-razzmatazz dark:hover:text-heliotrope transition-colors flex items-center gap-1.5 group-hover:underline break-all min-w-0"
                  >
                    <span className="break-all">{repo.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-forest/50 dark:text-cream/50 shrink-0 inline" />
                  </a>

                  {isFlagship && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-razzmatazz/25 text-razzmatazz dark:text-heliotrope border border-razzmatazz/40 flex items-center gap-1 backdrop-blur-xs">
                      <Flame className="w-3 h-3 text-razzmatazz fill-razzmatazz" />
                      Flagship Project
                    </span>
                  )}

                  {repo.fork && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-heliotrope/10 text-forest/70 dark:text-cream/70 border border-heliotrope/20 backdrop-blur-xs">
                      Forked
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold text-forest/80 dark:text-cream/80">
                  <span className="flex items-center gap-1 glass-pill px-3 py-1 rounded-xl">
                    <Star className="w-3.5 h-3.5 text-heliotrope fill-heliotrope" />
                    <span>{repo.stargazers_count.toLocaleString()}</span>
                  </span>

                  <span className="flex items-center gap-1 glass-pill px-3 py-1 rounded-xl">
                    <GitFork className="w-3.5 h-3.5 text-forest/50 dark:text-cream/50" />
                    <span>{repo.forks_count.toLocaleString()}</span>
                  </span>
                </div>
              </div>

              {repo.description && (
                <p className="text-xs sm:text-sm text-forest/90 dark:text-cream/90 leading-relaxed font-normal">
                  {repo.description}
                </p>
              )}

              {/* Topics tags if present */}
              {repo.topics && repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {repo.topics.slice(0, 6).map((topic) => (
                    <span
                      key={topic}
                      className="px-2.5 py-0.5 text-[11px] rounded-full bg-malachite/15 text-forest dark:text-cream font-medium border border-malachite/30 backdrop-blur-xs"
                    >
                      #{topic}
                    </span>
                  ))}
                  {repo.topics.length > 6 && (
                    <span className="text-[10px] text-forest/50 dark:text-cream/50 self-center">
                      +{repo.topics.length - 6} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-forest/60 dark:text-cream/60 font-medium border-t border-moss/15 dark:border-ochre/15">
                <div className="flex items-center gap-4">
                  {repo.language && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: langColor }} />
                      <span className="text-forest dark:text-cream font-semibold">{repo.language}</span>
                    </div>
                  )}

                  {repo.license && (
                    <span>License: {repo.license.spdx_id || repo.license.name}</span>
                  )}
                </div>

                <span>Updated {updatedDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More / Show Less Button */}
      {sortedRepos.length > 5 && (
        <div className="text-center pt-2">
          <button
            onClick={() => setDisplayCount(displayCount === 5 ? 10 : 5)}
            className="px-6 py-2.5 text-xs font-bold bg-[#fff2e6] hover:bg-[#ffe3d1] text-[#7a1a00] rounded-2xl transition-all cursor-pointer shadow-md border border-[#ffccb3]"
          >
            {displayCount === 5 ? `Show Top 10 Repositories (${sortedRepos.length} total)` : 'Show Top 5 Only'}
          </button>
        </div>
      )}
    </div>
  );
};
