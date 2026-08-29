import React from 'react';
import { AnalyzedProfile } from '../types';
import { ShieldCheck, Award, Zap, Code2, Users, Star, GitFork, Sparkles } from 'lucide-react';

interface DeveloperDNAProps {
  profile: AnalyzedProfile;
}

export const DeveloperDNA: React.FC<DeveloperDNAProps> = ({ profile }) => {
  const {
    totalStars,
    totalForks,
    languages,
    accountAgeYears,
    repos,
    nonForkCount,
    forkCount,
    user,
    avgStarsPerRepo,
  } = profile;

  // Calculate Developer DNA Scores (0-100)
  // 1. Star Magnetism (based on total stars & avg stars per repo)
  const starScore = Math.min(100, Math.round((totalStars / 50) * 40 + (avgStarsPerRepo / 5) * 60));

  // 2. Language Diversity (Polyglot index)
  const polyglotScore = Math.min(100, Math.round((languages.length / 8) * 100));

  // 3. Originality Index (Ratio of original repos to total)
  const totalReposCount = Math.max(1, repos.length);
  const originalityScore = Math.round((nonForkCount / totalReposCount) * 100);

  // 4. Activity Velocity (Repos created & maintained per year)
  const reposPerYear = totalReposCount / Math.max(1, accountAgeYears);
  const velocityScore = Math.min(100, Math.round((reposPerYear / 5) * 100));

  // 5. Community Reach (Followers & Forks)
  const reachScore = Math.min(100, Math.round(((user.followers + totalForks) / 100) * 100));

  const attributes = [
    {
      name: 'Star Magnetism',
      score: Math.max(15, starScore),
      description: 'Ability to attract stars & community interest',
      icon: Star,
      color: 'from-[#FFAB00] to-[#DD2E18]',
    },
    {
      name: 'Language Polyglot',
      score: Math.max(15, polyglotScore),
      description: `Proficient across ${languages.length} distinct programming languages`,
      icon: Code2,
      color: 'from-amber-400 to-[#FFAB00]',
    },
    {
      name: 'Originality Index',
      score: Math.max(15, originalityScore),
      description: `${nonForkCount} original repositories (${originalityScore}% of total)`,
      icon: ShieldCheck,
      color: 'from-emerald-400 to-teal-600',
    },
    {
      name: 'Repository Velocity',
      score: Math.max(15, velocityScore),
      description: `${reposPerYear.toFixed(1)} repos/year over ${accountAgeYears} years`,
      icon: Zap,
      color: 'from-orange-400 to-[#DD2E18]',
    },
    {
      name: 'Community Reach',
      score: Math.max(15, reachScore),
      description: `${user.followers.toLocaleString()} followers & ${totalForks.toLocaleString()} forks`,
      icon: Users,
      color: 'from-purple-400 to-pink-600',
    },
  ];

  // Overall DNA Rating
  const avgDnaScore = Math.round(
    (attributes.reduce((acc, curr) => acc + curr.score, 0)) / attributes.length
  );

  let dnaBadge = 'Rising Developer';
  if (avgDnaScore > 75) dnaBadge = 'Master Architect';
  else if (avgDnaScore > 50) dnaBadge = 'Seasoned Craftsperson';
  else if (avgDnaScore > 35) dnaBadge = 'Active Contributor';

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#FFAB00]/15">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-[#FFAB00]" />
            <h3 className="text-xl font-black text-forest dark:text-cream tracking-tight">
              Developer DNA & Capability Matrix
            </h3>
          </div>
          <p className="text-xs text-forest/70 dark:text-cream/70 mt-1">
            Algorithmic skill radar based on repository composition, language diversity, and community traction
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 bg-[#22120a]/80 rounded-2xl border border-[#ffccb3]/30 backdrop-blur-md self-start sm:self-auto">
          <Sparkles className="w-4 h-4 text-[#FFAB00]" />
          <div>
            <span className="text-[10px] text-cream/60 block uppercase font-bold tracking-wider">Overall DNA Score</span>
            <span className="text-sm font-black text-[#FFAB00]">
              {avgDnaScore}/100 <span className="text-cream/90 font-normal text-xs">({dnaBadge})</span>
            </span>
          </div>
        </div>
      </div>

      {/* Attribute Breakdown Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attributes.map((attr) => {
          const IconComponent = attr.icon;
          return (
            <div
              key={attr.name}
              className="p-4 rounded-2xl bg-[#22120a]/60 border border-[#FFAB00]/20 space-y-3 hover:border-[#FFAB00]/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#FFAB00]/15 border border-[#FFAB00]/30 text-[#FFAB00]">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-cream">{attr.name}</h4>
                    <p className="text-[11px] text-cream/60">{attr.description}</p>
                  </div>
                </div>
                <span className="text-sm font-black font-mono text-[#FFAB00]">{attr.score}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#100a06] h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${attr.color} transition-all duration-700`}
                  style={{ width: `${attr.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
