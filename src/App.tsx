import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileSummaryBanner } from './components/ProfileSummaryBanner';
import { RepoStatsCard } from './components/RepoStatsCard';
import { LanguageChart } from './components/LanguageChart';
import { TopRepos } from './components/TopRepos';
import { ActivitySummary } from './components/ActivitySummary';
import { DeveloperDNA } from './components/DeveloperDNA';
import { CompareProfiles } from './components/CompareProfiles';
import { GitHubWrappedModal } from './components/GitHubWrappedModal';
import { SkeletonLoader } from './components/SkeletonLoader';
import { ErrorMessage } from './components/ErrorMessage';
import { fetchGitHubUserData, checkApiRateLimit, getRateLimitInfo } from './services/githubApi';
import { analyzeGitHubProfile, compareProfiles } from './utils/analyzer';
import { AnalyzedProfile, ComparisonData, RateLimitInfo } from './types';
import { Github, Sparkles } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  const [activeMode, setActiveMode] = useState<'single' | 'compare'>('single');
  const [currentUsername, setCurrentUsername] = useState<string>('');
  const [analyzedProfile, setAnalyzedProfile] = useState<AnalyzedProfile | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo>(getRateLimitInfo());
  const [showWrappedModal, setShowWrappedModal] = useState<boolean>(false);

  // Sync dark mode class on HTML document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Initial Rate Limit check & URL query params check
  useEffect(() => {
    checkApiRateLimit().then((info) => setRateLimit(info));

    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('user');
    const compareParam = params.get('compare');

    if (compareParam) {
      const parts = compareParam.split(',');
      if (parts.length >= 2) {
        setActiveMode('compare');
        handleCompare(parts[0], parts[1]);
        return;
      }
    }

    if (userParam) {
      handleAnalyze(userParam);
    } else {
      // Default demo profile on initial load
      handleAnalyze('torvalds');
    }
  }, []);

  const handleAnalyze = async (username: string) => {
    if (!username.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    setCurrentUsername(username);

    // Update URL query string for shareability
    const newUrl = `${window.location.pathname}?user=${encodeURIComponent(username)}`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    try {
      const { user, repos } = await fetchGitHubUserData(username);
      const profile = analyzeGitHubProfile(user, repos);
      setAnalyzedProfile(profile);
      setRateLimit(getRateLimitInfo());
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch GitHub profile data.');
      setAnalyzedProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompare = async (user1: string, user2: string) => {
    if (!user1.trim() || !user2.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);

    // Update URL
    const newUrl = `${window.location.pathname}?compare=${encodeURIComponent(user1)},${encodeURIComponent(user2)}`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    try {
      const [res1, res2] = await Promise.all([
        fetchGitHubUserData(user1),
        fetchGitHubUserData(user2),
      ]);

      const prof1 = analyzeGitHubProfile(res1.user, res1.repos);
      const prof2 = analyzeGitHubProfile(res2.user, res2.repos);

      const comp = compareProfiles(prof1, prof2);
      setComparisonData(comp);
      setRateLimit(getRateLimitInfo());
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch GitHub profile data for comparison.');
      setComparisonData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenSaved = () => {
    checkApiRateLimit().then((info) => setRateLimit(info));
    if (currentUsername && activeMode === 'single') {
      handleAnalyze(currentUsername);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#100a06] dark:bg-[#0b0604] text-[#fceee8] dark:text-[#fff2ed] font-sans transition-colors duration-300 selection:bg-[#DD2E18] selection:text-white flex flex-col justify-between relative">
      {/* Dynamic Ambient Lighting with Orange (#FFAB00) & Harley Davidson Orange (#DD2E18) */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-[#FFAB00]/20 via-[#DD2E18]/20 to-transparent dark:from-[#FFAB00]/25 dark:via-[#DD2E18]/25 dark:to-transparent blur-3xl z-0" />

      <div className="w-full max-w-full overflow-x-hidden relative z-10">
        {/* Navigation Header */}
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          rateLimit={rateLimit}
          activeMode={activeMode}
          setActiveMode={(mode) => {
            setActiveMode(mode);
            setErrorMsg(null);
          }}
          onTokenSaved={handleTokenSaved}
        />

        {/* Main Content Area */}
        <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 overflow-x-hidden">
          {/* Search Form Card */}
          <SearchForm
            onAnalyze={handleAnalyze}
            onCompare={handleCompare}
            isLoading={isLoading}
            initialUsername={currentUsername}
            mode={activeMode}
          />

          {/* State Rendering: Error, Loading Skeleton, or Analysis Data */}
          {errorMsg ? (
            <ErrorMessage
              message={errorMsg}
              onRetry={() => {
                if (activeMode === 'single') handleAnalyze(currentUsername);
              }}
              rateLimit={rateLimit}
            />
          ) : isLoading ? (
            <SkeletonLoader />
          ) : activeMode === 'single' && analyzedProfile ? (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Profile Header */}
              <ProfileHeader
                profile={analyzedProfile}
                onOpenShareModal={() => setShowWrappedModal(true)}
              />

              {/* AI-like Profile Summary & Persona */}
              <ProfileSummaryBanner profile={analyzedProfile} />

              {/* Core Repo & Plain English One-Line Insights */}
              <RepoStatsCard profile={analyzedProfile} />

              {/* Developer DNA & Capability Matrix */}
              <DeveloperDNA profile={analyzedProfile} />

              {/* Language Breakdown Chart */}
              <LanguageChart profile={analyzedProfile} />

              {/* Activity & Maintenance Summary */}
              <ActivitySummary profile={analyzedProfile} />

              {/* Top Repositories List */}
              <TopRepos profile={analyzedProfile} />
            </div>
          ) : activeMode === 'compare' && comparisonData ? (
            <div className="animate-in fade-in duration-300">
              <CompareProfiles comparisonData={comparisonData} />
            </div>
          ) : null}
        </main>
      </div>

      {/* GitHub Wrapped Share Modal */}
      {showWrappedModal && analyzedProfile && (
        <GitHubWrappedModal
          profile={analyzedProfile}
          onClose={() => setShowWrappedModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-moss/20 dark:border-ochre/20 bg-cream/60 dark:bg-[#1a2410]/60 backdrop-blur-xl mt-16 py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-forest/70 dark:text-cream/70">
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4 text-moss dark:text-ochre" />
            <span>GitHub Profile Analyzer — Powered by GitHub REST API</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-semibold text-forest dark:text-cream">
              <Sparkles className="w-3.5 h-3.5 text-ochre" />
              Direct Client-Side Integration
            </span>
            <span>•</span>
            <a
              href="https://docs.github.com/en/rest"
              target="_blank"
              rel="noreferrer"
              className="hover:text-terracotta dark:hover:text-ochre transition-colors"
            >
              GitHub API Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
