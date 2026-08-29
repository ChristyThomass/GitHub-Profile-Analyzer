import React, { useState } from 'react';
import { Github, Key, Layers, Scale } from 'lucide-react';
import { RateLimitInfo } from '../types';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  rateLimit: RateLimitInfo;
  activeMode: 'single' | 'compare';
  setActiveMode: (mode: 'single' | 'compare') => void;
  onTokenSaved: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  rateLimit,
  activeMode,
  setActiveMode,
  onTokenSaved,
}) => {
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenInput, setTokenInput] = useState(localStorage.getItem('github_pat_token') || '');
  const [tokenSavedMsg, setTokenSavedMsg] = useState(false);

  const handleSaveToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem('github_pat_token', tokenInput.trim());
    } else {
      localStorage.removeItem('github_pat_token');
    }
    setTokenSavedMsg(true);
    setTimeout(() => {
      setTokenSavedMsg(false);
      setShowTokenModal(false);
      onTokenSaved();
    }, 1200);
  };

  const hasPat = !!localStorage.getItem('github_pat_token');

  return (
    <header className="sticky top-0 z-40 glass-header transition-colors w-full overflow-hidden shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-0 sm:h-16 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
        {/* Top bar on mobile / Left area on desktop */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-2 min-w-0">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[#DD2E18] to-[#FFAB00] text-white rounded-xl shadow-md shadow-[#DD2E18]/30 flex items-center justify-center shrink-0 border border-white/30 backdrop-blur-md">
              <Github className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-forest dark:text-cream text-sm sm:text-lg tracking-tight leading-none flex items-center gap-1.5 truncate">
                <span className="truncate">GitHub Profile Analyzer</span>
              </h1>
              <p className="text-xs text-forest/70 dark:text-cream/70 hidden sm:block mt-0.5 truncate">
                Developer statistics, language breakdowns & project showcase
              </p>
            </div>
          </div>
        </div>

        {/* Navigation / Mode Switcher */}
        <div className="w-full sm:w-auto flex items-center justify-center bg-[#22120a]/80 p-1 rounded-2xl border border-[#ffccb3]/30 text-xs font-medium backdrop-blur-md shadow-inner">
          <button
            onClick={() => setActiveMode('single')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeMode === 'single'
                ? 'bg-[#fff2e6] text-[#7a1a00] shadow-sm font-bold backdrop-blur-md border border-[#ffccb3]'
                : 'text-cream/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#7a1a00]" />
            <span>Single Profile</span>
          </button>
          <button
            onClick={() => setActiveMode('compare')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeMode === 'compare'
                ? 'bg-[#fff2e6] text-[#7a1a00] shadow-sm font-bold backdrop-blur-md border border-[#ffccb3]'
                : 'text-cream/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-[#7a1a00]" />
            <span>Compare 2 Users</span>
          </button>
        </div>
      </div>

      {/* API Token Configuration Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 bg-forest/60 dark:bg-black/70 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-moss/20 text-moss dark:text-ochre rounded-xl border border-moss/30 backdrop-blur-md">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-forest dark:text-cream text-lg">GitHub Personal Token</h3>
              </div>
              <button
                onClick={() => setShowTokenModal(false)}
                className="text-forest/60 dark:text-cream/60 hover:text-forest dark:hover:text-cream text-sm p-1 rounded-lg hover:bg-moss/10"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-forest/80 dark:text-cream/80 leading-relaxed">
              Unauthenticated GitHub API requests are capped at <strong>60 requests/hour</strong>. Adding a Personal Access Token increases limit to <strong>5,000 requests/hour</strong>.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-forest dark:text-cream uppercase tracking-wider">
                Personal Access Token (optional)
              </label>
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-forest dark:text-cream font-mono text-sm focus:outline-none"
              />
              <p className="text-xs text-forest/60 dark:text-cream/60">
                Your token is stored locally in your browser and never sent anywhere except directly to <code>api.github.com</code>.
              </p>
            </div>

            {tokenSavedMsg && (
              <div className="p-2.5 bg-moss/20 text-forest dark:text-cream border border-moss/40 text-xs rounded-xl font-medium text-center backdrop-blur-md">
                ✓ Token settings updated successfully!
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowTokenModal(false)}
                className="px-4 py-2 text-sm text-forest/70 dark:text-cream/70 hover:text-forest dark:hover:text-cream"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveToken}
                className="px-4 py-2 text-sm font-bold bg-[#fff2e6] hover:bg-[#ffe3d1] text-[#7a1a00] rounded-xl shadow-md border border-[#ffccb3] backdrop-blur-md transition-all cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
