import React, { useState } from 'react';
import { AnalyzedProfile } from '../types';
import { Tag, Copy, Check, Terminal, Sparkles, Layers } from 'lucide-react';
import { getLanguageColor } from '../utils/languageColors';

interface TechStackBadgesProps {
  profile: AnalyzedProfile;
}

export const TechStackBadges: React.FC<TechStackBadgesProps> = ({ profile }) => {
  const { languages, repos } = profile;
  const [copiedBadge, setCopiedBadge] = useState<string | null>(null);
  const [copiedAllMarkdown, setCopiedAllMarkdown] = useState(false);

  // Collect unique topics across all repositories
  const allTopicsSet = new Set<string>();
  repos.forEach((repo) => {
    if (repo.topics && Array.isArray(repo.topics)) {
      repo.topics.forEach((topic) => {
        if (topic.trim()) allTopicsSet.add(topic.trim().toLowerCase());
      });
    }
  });

  const topTopics = Array.from(allTopicsSet).slice(0, 15);

  // Helper to generate shields.io Markdown badge for a technology/language
  const generateShieldMarkdown = (name: string, hexColor?: string) => {
    const cleanName = encodeURIComponent(name);
    const color = hexColor ? hexColor.replace('#', '') : 'FFAB00';
    return `![${name}](https://img.shields.io/badge/${cleanName}-${color}?style=for-the-badge&logo=${cleanName.toLowerCase()}&logoColor=white)`;
  };

  const handleCopyBadge = (name: string, hexColor?: string) => {
    const md = generateShieldMarkdown(name, hexColor);
    navigator.clipboard.writeText(md);
    setCopiedBadge(name);
    setTimeout(() => setCopiedBadge(null), 2000);
  };

  const handleCopyAllMarkdown = () => {
    const langMarkdown = languages
      .map((l) => generateShieldMarkdown(l.name, l.color))
      .join('\n');
    navigator.clipboard.writeText(langMarkdown);
    setCopiedAllMarkdown(true);
    setTimeout(() => setCopiedAllMarkdown(false), 2000);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#FFAB00]/15">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#FFAB00]" />
            <h3 className="text-xl font-black text-forest dark:text-cream tracking-tight">
              Tech Stack & Profile README Badges
            </h3>
          </div>
          <p className="text-xs text-forest/70 dark:text-cream/70 mt-1">
            Automatically extracted tech stack & topics across public repositories. Click any badge to copy README Markdown!
          </p>
        </div>

        <button
          onClick={handleCopyAllMarkdown}
          className="px-4 py-2 bg-[#fff2e6] hover:bg-[#ffe3d1] text-[#7a1a00] text-xs font-bold rounded-xl border border-[#ffccb3] shadow-xs flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
        >
          {copiedAllMarkdown ? <Check className="w-3.5 h-3.5 text-[#7a1a00]" /> : <Copy className="w-3.5 h-3.5 text-[#7a1a00]" />}
          <span>{copiedAllMarkdown ? 'Copied All Badges!' : 'Copy All README Badges'}</span>
        </button>
      </div>

      {/* Language Shields List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-cream/70 uppercase tracking-wider flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-[#FFAB00]" />
          <span>Core Languages & Frameworks ({languages.length})</span>
        </h4>

        <div className="flex flex-wrap gap-2.5">
          {languages.map((lang) => {
            const isCopied = copiedBadge === lang.name;
            return (
              <button
                key={lang.name}
                onClick={() => handleCopyBadge(lang.name, lang.color)}
                title={`Click to copy GitHub README badge for ${lang.name}`}
                className="group flex items-center gap-2 px-3 py-1.5 bg-[#22120a]/80 hover:bg-[#FFAB00]/20 rounded-xl border border-[#ffccb3]/30 text-cream text-xs font-semibold transition-all cursor-pointer shadow-xs"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: lang.color }}
                />
                <span>{lang.name}</span>
                <span className="text-[10px] text-cream/50 font-mono">({lang.percentage}%)</span>
                {isCopied ? (
                  <Check className="w-3 h-3 text-[#FFAB00] ml-1" />
                ) : (
                  <Copy className="w-3 h-3 text-cream/40 group-hover:text-[#FFAB00] ml-1 transition-colors" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topics & Tag Cloud */}
      {topTopics.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-cream/70 uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#FFAB00]" />
            <span>Repository Topics & Ecosystem Tags</span>
          </h4>

          <div className="flex flex-wrap gap-2">
            {topTopics.map((topic) => (
              <span
                key={topic}
                className="px-2.5 py-1 bg-[#100a06]/70 text-cream/80 text-[11px] font-medium rounded-lg border border-white/10 flex items-center gap-1"
              >
                <span className="text-[#FFAB00]">#</span>
                <span>{topic}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
