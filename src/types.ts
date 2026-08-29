export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
  } | null;
  topics?: string[];
  default_branch: string;
}

export interface LanguageStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface OneLineInsight {
  id: string;
  emoji: string;
  title: string;
  text: string;
  type: 'stars' | 'age' | 'language' | 'flagship' | 'forks' | 'activity' | 'avg_stars';
}

export interface AnalyzedProfile {
  user: GitHubUser;
  repos: GitHubRepo[];
  totalStars: number;
  totalForks: number;
  mostStarredRepo: GitHubRepo | null;
  mostForkedRepo: GitHubRepo | null;
  languages: LanguageStat[];
  topLanguage: string;
  avgStarsPerRepo: number;
  avgForksPerRepo: number;
  accountAgeYears: number;
  accountAgeMonths: number;
  createdDateFormatted: string;
  recentActivityCount: number;
  recentActivityPercentage: number;
  insights: OneLineInsight[];
  personaTitle: string;
  summaryParagraph: string;
  topRepos: GitHubRepo[];
  nonForkCount: number;
  forkCount: number;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: Date | null;
}

export interface ComparisonMetric {
  label: string;
  user1Val: number | string;
  user2Val: number | string;
  winner: 1 | 2 | 0; // 1 = user1, 2 = user2, 0 = tie
  format?: 'number' | 'date' | 'string';
}

export interface ComparisonData {
  profile1: AnalyzedProfile;
  profile2: AnalyzedProfile;
  metrics: ComparisonMetric[];
  verdict: string;
}
