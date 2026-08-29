import React, { useState, useEffect } from 'react';
import { Search, Sparkles, History, UserCheck, ArrowRightLeft, Trash2, X } from 'lucide-react';

interface SearchFormProps {
  onAnalyze: (username: string) => void;
  onCompare?: (user1: string, user2: string) => void;
  isLoading: boolean;
  initialUsername?: string;
  mode: 'single' | 'compare';
}

const PRESET_USERS = [
  { name: 'Linus Torvalds', username: 'torvalds', label: 'Linux Creator' },
  { name: 'Dan Abramov', username: 'gaearon', label: 'React Co-Author' },
  { name: 'shadcn', username: 'shadcn', label: 'UI Architect' },
  { name: 'Sindre Sorhus', username: 'sindresorhus', label: 'Node Master' },
  { name: 'TJ Holowaychuk', username: 'tj', label: 'Express Creator' },
];

export const SearchForm: React.FC<SearchFormProps> = ({
  onAnalyze,
  onCompare,
  isLoading,
  initialUsername = '',
  mode,
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [user2, setUser2] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (initialUsername) {
      setUsername(initialUsername);
    }
  }, [initialUsername]);

  useEffect(() => {
    const saved = localStorage.getItem('github_analyzer_history');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch {
        // ignore
      }
    }
  }, []);

  const saveToHistory = (name: string) => {
    if (!name.trim()) return;
    const clean = name.trim().toLowerCase();
    const updated = [clean, ...recentSearches.filter((item) => item.toLowerCase() !== clean)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('github_analyzer_history', JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem('github_analyzer_history');
  };

  const handleRemoveSingleRecent = (e: React.MouseEvent, targetUsername: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item.toLowerCase() !== targetUsername.toLowerCase());
    setRecentSearches(updated);
    if (updated.length === 0) {
      localStorage.removeItem('github_analyzer_history');
    } else {
      localStorage.setItem('github_analyzer_history', JSON.stringify(updated));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'single') {
      if (!username.trim()) return;
      saveToHistory(username);
      onAnalyze(username.trim());
    } else {
      if (!username.trim() || !user2.trim()) return;
      saveToHistory(username);
      saveToHistory(user2);
      if (onCompare) {
        onCompare(username.trim(), user2.trim());
      }
    }
  };

  const handleChipClick = (targetUsername: string) => {
    if (mode === 'single') {
      setUsername(targetUsername);
      saveToHistory(targetUsername);
      onAnalyze(targetUsername);
    } else {
      if (!username) {
        setUsername(targetUsername);
      } else {
        setUser2(targetUsername);
      }
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl transition-colors">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-forest dark:text-cream tracking-tight">
            {mode === 'single' ? 'Analyze Any GitHub Profile' : 'Head-to-Head Profile Comparison'}
          </h2>
          <p className="text-sm sm:text-base text-forest/70 dark:text-cream/70">
            {mode === 'single'
              ? 'Uncover repository statistics, language breakdowns, flagship projects, and developer activity metrics.'
              : 'Compare two GitHub developers side-by-side across repository counts, total stars, followers, and language diversity.'}
          </p>
        </div>

        {mode === 'single' ? (
          /* Single Username Input */
          <div className="relative max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-moss">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter GitHub username (e.g. torvalds)"
                disabled={isLoading}
                className="w-full pl-11 pr-4 py-3.5 glass-input rounded-2xl text-forest dark:text-cream placeholder-forest/40 dark:placeholder-cream/40 focus:outline-none focus:ring-2 focus:ring-moss/50 transition-all font-medium text-base shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="px-6 py-3.5 bg-[#fff2e6] hover:bg-[#ffe3d1] disabled:opacity-50 text-[#7a1a00] font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap border border-[#ffccb3]"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#7a1a00]/30 border-t-[#7a1a00] rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 text-[#7a1a00]" />
                  <span>Analyze Profile</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Dual Username Comparison Inputs */
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-forest dark:text-cream uppercase tracking-wider">
                  Developer #1
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <UserCheck className="w-4 h-4 text-[#FFAB00]" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="First username (e.g. torvalds)"
                    className="w-full pl-10 pr-4 py-3 glass-input rounded-xl text-forest dark:text-cream font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#FFAB00]/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-forest dark:text-cream uppercase tracking-wider">
                  Developer #2
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <UserCheck className="w-4 h-4 text-[#DD2E18]" />
                  </div>
                  <input
                    type="text"
                    value={user2}
                    onChange={(e) => setUser2(e.target.value)}
                    placeholder="Second username (e.g. gaearon)"
                    className="w-full pl-10 pr-4 py-3 glass-input rounded-xl text-forest dark:text-cream font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#DD2E18]/50"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !username.trim() || !user2.trim()}
              className="w-full py-3.5 bg-[#fff2e6] hover:bg-[#ffe3d1] disabled:opacity-50 text-[#7a1a00] font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all border border-[#ffccb3] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#7a1a00]/30 border-t-[#7a1a00] rounded-full animate-spin" />
                  <span>Fetching Comparison Data...</span>
                </>
              ) : (
                <>
                  <ArrowRightLeft className="w-5 h-5 text-[#7a1a00]" />
                  <span>Compare Profiles</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Preset Sample User Chips */}
        <div className="max-w-2xl mx-auto pt-4 border-t border-moss/20 dark:border-ochre/20">
          {/* Sample Profiles */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-forest/70 dark:text-cream/70 uppercase tracking-wider mr-1">
              Sample Profiles:
            </span>
            {PRESET_USERS.map((preset) => (
              <button
                key={preset.username}
                type="button"
                onClick={() => handleChipClick(preset.username)}
                className="px-3 py-1 bg-[#22120a]/80 hover:bg-[#DD2E18]/20 hover:text-[#FFAB00] text-forest dark:text-cream text-xs font-medium rounded-full border border-[#FFAB00]/25 transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-2xs"
              >
                <span>@{preset.username}</span>
                <span className="text-[10px] text-forest/60 dark:text-cream/60 font-normal">({preset.label})</span>
              </button>
            ))}
          </div>

          {/* Recent Search Chips */}
          {recentSearches.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 pt-2">
              <span className="text-xs font-semibold text-forest/70 dark:text-cream/70 uppercase tracking-wider flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-[#FFAB00]" /> Recent:
              </span>
              {recentSearches.map((searched) => (
                <div
                  key={searched}
                  className="group inline-flex items-center gap-1 px-2.5 py-1 bg-[#22120a]/80 hover:bg-[#DD2E18]/20 text-forest/90 dark:text-cream/90 text-xs rounded-lg border border-[#FFAB00]/20 transition-all backdrop-blur-xs"
                >
                  <button
                    type="button"
                    onClick={() => handleChipClick(searched)}
                    className="hover:text-[#FFAB00] cursor-pointer font-medium"
                  >
                    @{searched}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveSingleRecent(e, searched)}
                    title={`Remove @${searched} from history`}
                    className="p-0.5 rounded-md hover:bg-[#DD2E18]/40 text-cream/60 hover:text-white transition-colors cursor-pointer ml-0.5"
                  >
                    <X className="w-3 h-3 text-[#FFAB00] hover:text-white" />
                  </button>
                </div>
              ))}
              {recentSearches.length > 1 && (
                <button
                  type="button"
                  onClick={handleClearHistory}
                  title="Clear All Recent History"
                  className="px-2 py-1 bg-[#fff2e6] hover:bg-[#ffe3d1] text-[#7a1a00] text-[11px] font-bold rounded-lg border border-[#ffccb3] transition-all flex items-center gap-1 cursor-pointer ml-1 shadow-xs opacity-80 hover:opacity-100"
                >
                  <Trash2 className="w-3 h-3 text-[#7a1a00]" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
