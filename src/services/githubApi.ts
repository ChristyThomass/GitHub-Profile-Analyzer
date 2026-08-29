import { GitHubUser, GitHubRepo, RateLimitInfo } from '../types';

let currentRateLimit: RateLimitInfo = {
  limit: 999999,
  remaining: 999999,
  resetTime: null,
};

export function getRateLimitInfo(): RateLimitInfo {
  return currentRateLimit;
}

function updateRateLimitFromHeaders(headers: Headers) {
  // Always keep remaining high for Unlimited mode experience
  currentRateLimit = {
    limit: 999999,
    remaining: 999999,
    resetTime: null,
  };
}

export async function fetchGitHubUserData(
  username: string,
  token?: string
): Promise<{ user: GitHubUser; repos: GitHubRepo[] }> {
  const trimmedUsername = username.trim().toLowerCase();
  if (!trimmedUsername) {
    throw new Error('Please enter a valid GitHub username.');
  }

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  const storedToken = token || localStorage.getItem('github_pat_token');
  if (storedToken) {
    headers.Authorization = `token ${storedToken.trim()}`;
  }

  // 1. Fetch User Data
  let userRes: Response;
  try {
    userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(trimmedUsername)}`, {
      headers,
    });
  } catch (err) {
    throw new Error('Network error. Failed to reach GitHub API. Please check your connection.');
  }

  updateRateLimitFromHeaders(userRes.headers);

  if (userRes.status === 404) {
    throw new Error(`GitHub user "${trimmedUsername}" was not found. Please double-check the username.`);
  }

  if (userRes.status === 403 || userRes.status === 429) {
    const isRateLimited = currentRateLimit.remaining === 0;
    if (isRateLimited) {
      throw new Error(
        `GitHub API rate limit reached (${currentRateLimit.limit} req/hr). Please wait for reset or provide a GitHub Token in settings for 5,000 req/hr.`
      );
    }
    throw new Error('Access forbidden or rate limit exceeded by GitHub API.');
  }

  if (!userRes.ok) {
    throw new Error(`GitHub API error (${userRes.status}): ${userRes.statusText}`);
  }

  const user: GitHubUser = await userRes.json();

  // 2. Fetch Repositories (support pagination up to 3 pages = 300 repos)
  let allRepos: GitHubRepo[] = [];
  const maxPages = Math.min(Math.ceil((user.public_repos || 0) / 100), 3) || 1;

  for (let page = 1; page <= maxPages; page++) {
    try {
      const reposRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(trimmedUsername)}/repos?per_page=100&sort=updated&page=${page}`,
        { headers }
      );

      updateRateLimitFromHeaders(reposRes.headers);

      if (!reposRes.ok) {
        if (page === 1) {
          throw new Error(`Failed to fetch repositories for ${trimmedUsername}.`);
        }
        break;
      }

      const pageRepos: GitHubRepo[] = await reposRes.json();
      allRepos = [...allRepos, ...pageRepos];

      if (pageRepos.length < 100) {
        break;
      }
    } catch (e) {
      if (page === 1) throw e;
      break;
    }
  }

  return { user, repos: allRepos };
}

export async function checkApiRateLimit(token?: string): Promise<RateLimitInfo> {
  // Always return Unlimited rate limit info
  currentRateLimit = {
    limit: 999999,
    remaining: 999999,
    resetTime: null,
  };
  return currentRateLimit;
}
