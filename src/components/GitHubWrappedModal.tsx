import React, { useRef, useEffect, useState } from 'react';
import { Download, Copy, Twitter, Check, Sparkles, X, Github, Award } from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { AnalyzedProfile } from '../types';

interface GitHubWrappedModalProps {
  profile: AnalyzedProfile;
  onClose: () => void;
}

export const GitHubWrappedModal: React.FC<GitHubWrappedModalProps> = ({ profile, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    user,
    totalStars,
    totalForks,
    topLanguage,
    accountAgeYears,
    createdDateFormatted,
    personaTitle,
    summaryParagraph,
    mostStarredRepo,
  } = profile;

  useEffect(() => {
    // Trigger celebratory confetti on modal launch
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  }, []);

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, quality: 0.95 });
      const link = document.createElement('a');
      link.download = `${user.login}-github-wrapped.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export card image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopySummary = () => {
    const text = `📊 GitHub Profile Wrapped for @${user.login} (${personaTitle}):\n\n⭐ Total Stars: ${totalStars.toLocaleString()}\n📚 Public Repos: ${user.public_repos}\n🔀 Total Forks: ${totalForks.toLocaleString()}\n🧑‍💻 Top Language: ${topLanguage}\n📅 Account Started: ${createdDateFormatted} (${accountAgeYears}y active)\n🔥 Flagship: ${mostStarredRepo?.name || 'N/A'}\n\nSummary: "${summaryParagraph.slice(0, 180)}..."`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tweetText = encodeURIComponent(
    `Check out my GitHub Profile Analysis for @${user.login}!\n\n🌟 ${totalStars} Stars | 🧑‍💻 Top Language: ${topLanguage} | 📅 Active ${accountAgeYears}y\nPersona: "${personaTitle}"`
  );

  return (
    <div className="fixed inset-0 z-50 bg-forest/60 dark:bg-black/75 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel border border-moss/30 dark:border-ochre/30 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-cream hover:text-[#FFAB00] glass-pill border border-[#FFAB00]/30 rounded-full transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-ochre" />
          <h3 className="font-extrabold text-forest dark:text-cream text-xl">GitHub Wrapped Card</h3>
        </div>

        {/* Exportable Card Container */}
        <div
          ref={cardRef}
          className="bg-gradient-to-br from-[#1a0e08] via-[#281308] to-[#120703] p-6 sm:p-8 rounded-2xl border border-[#FFAB00]/40 text-white space-y-6 shadow-2xl relative overflow-hidden"
        >
          {/* Card Top Branding Header */}
          <div className="flex items-center justify-between border-b border-white/15 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#DD2E18] rounded-lg">
                <Github className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xs uppercase tracking-wider text-[#FFAB00]">
                GitHub Profile Wrapped
              </span>
            </div>
            <span className="text-[10px] font-mono text-white/60">
              {new Date().getFullYear()} Report
            </span>
          </div>

          {/* User Profile Info */}
          <div className="flex items-center gap-4">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-16 h-16 rounded-2xl ring-2 ring-[#FFAB00]/50 shadow-md object-cover"
            />
            <div>
              <h4 className="font-extrabold text-xl text-white tracking-tight">{user.name || user.login}</h4>
              <p className="text-xs font-mono text-[#FFAB00]">@{user.login}</p>
              <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFAB00]/20 text-[#FFAB00] border border-[#FFAB00]/40">
                <Award className="w-3 h-3 text-[#FFAB00]" />
                <span>{personaTitle}</span>
              </div>
            </div>
          </div>

          {/* Metrics 4-Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white/10 rounded-xl border border-white/15 text-center">
              <span className="text-lg block font-black text-[#FFAB00]">{totalStars.toLocaleString()}</span>
              <span className="text-[10px] text-white/70 font-medium">Total Stars</span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/15 text-center">
              <span className="text-lg block font-black text-white">{user.public_repos}</span>
              <span className="text-[10px] text-white/70 font-medium">Public Repos</span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/15 text-center">
              <span className="text-lg block font-black text-[#FFAB00]">{totalForks.toLocaleString()}</span>
              <span className="text-[10px] text-white/70 font-medium">Forks</span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/15 text-center">
              <span className="text-xs sm:text-sm block font-black text-[#DD2E18]">{createdDateFormatted}</span>
              <span className="text-[10px] text-white/70 font-medium">Account Started</span>
            </div>
          </div>

          {/* Core Insights Highlight */}
          <div className="p-4 bg-white/10 rounded-xl border border-white/15 space-y-2 text-xs">
            <div className="flex justify-between items-center text-[#FFAB00] font-bold">
              <span>Top Primary Language:</span>
              <span className="text-white font-mono bg-[#DD2E18]/40 px-2 py-0.5 rounded">{topLanguage}</span>
            </div>
            {mostStarredRepo && (
              <div className="flex justify-between items-center text-white/80">
                <span>Flagship Repository:</span>
                <span className="text-[#FFAB00] font-bold">{mostStarredRepo.name} ({mostStarredRepo.stargazers_count}⭐)</span>
              </div>
            )}
          </div>

          {/* Summary snippet */}
          <p className="text-xs text-white/90 italic leading-relaxed border-t border-white/15 pt-3">
            "{summaryParagraph}"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={handleCopySummary}
            className="flex-1 px-4 py-2.5 bg-[#fff2e6] hover:bg-[#ffe3d1] text-[#7a1a00] font-bold text-xs rounded-xl border border-[#ffccb3] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-[#7a1a00]" /> : <Copy className="w-4 h-4 text-[#7a1a00]" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary Text'}</span>
          </button>

          <a
            href={`https://twitter.com/intent/tweet?text=${tweetText}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-[#fff2e6] hover:bg-[#ffe3d1] text-[#7a1a00] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-[#ffccb3] shadow-sm"
          >
            <Twitter className="w-4 h-4 text-[#7a1a00]" />
            <span>Tweet Insights</span>
          </a>

          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="flex-1 px-4 py-2.5 bg-[#fff2e6] hover:bg-[#ffe3d1] disabled:opacity-50 text-[#7a1a00] font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#ffccb3]"
          >
            <Download className="w-4 h-4 text-[#7a1a00]" />
            <span>{isDownloading ? 'Exporting PNG...' : 'Download Card Image'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
