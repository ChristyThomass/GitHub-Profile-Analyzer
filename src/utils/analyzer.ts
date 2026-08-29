import { GitHubUser, GitHubRepo, AnalyzedProfile, LanguageStat, OneLineInsight, ComparisonData, ComparisonMetric } from '../types';
import { getLanguageColor } from './languageColors';

export function analyzeGitHubProfile(user: GitHubUser, repos: GitHubRepo[]): AnalyzedProfile {
  const nonForkRepos = repos.filter((r) => !r.fork);
  const forkRepos = repos.filter((r) => r.fork);

  // We analyze non-fork repos for stars & languages primary, but count all public repos
  const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((acc, r) => acc + (r.forks_count || 0), 0);

  // Most starred repo
  const sortedByStars = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);
  const mostStarredRepo = sortedByStars.length > 0 && sortedByStars[0].stargazers_count > 0 ? sortedByStars[0] : (repos[0] || null);

  // Most forked repo
  const sortedByForks = [...repos].sort((a, b) => b.forks_count - a.forks_count);
  const mostForkedRepo = sortedByForks.length > 0 && sortedByForks[0].forks_count > 0 ? sortedByForks[0] : null;

  // Language Breakdown
  const languageCounts: Record<string, number> = {};
  let reposWithLanguageCount = 0;

  repos.forEach((r) => {
    if (r.language) {
      languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
      reposWithLanguageCount++;
    }
  });

  const languageEntries = Object.entries(languageCounts).sort((a, b) => b[1] - a[1]);

  const languages: LanguageStat[] = languageEntries.map(([name, count]) => ({
    name,
    count,
    percentage: reposWithLanguageCount > 0 ? Math.round((count / reposWithLanguageCount) * 100) : 0,
    color: getLanguageColor(name),
  }));

  const topLanguage = languages.length > 0 ? languages[0].name : 'N/A';

  // Account Age calculation
  const createdDate = new Date(user.created_at);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdDate.getTime());
  const accountAgeDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const accountAgeYears = parseFloat((accountAgeDays / 365.25).toFixed(1));
  const accountAgeMonths = Math.floor((accountAgeDays % 365) / 30);

  const createdDateFormatted = createdDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  });

  // Averages
  const repoCountForAvg = repos.length || 1;
  const avgStarsPerRepo = parseFloat((totalStars / repoCountForAvg).toFixed(1));
  const avgForksPerRepo = parseFloat((totalForks / repoCountForAvg).toFixed(1));

  // Activity calculation (updated in last 1 year)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const recentActivityCount = repos.filter((r) => {
    const updatedAt = new Date(r.pushed_at || r.updated_at);
    return updatedAt >= oneYearAgo;
  }).length;

  const recentActivityPercentage = repos.length > 0 ? Math.round((recentActivityCount / repos.length) * 100) : 0;

  // Top Repos (up to 5 by stars)
  const topRepos = sortedByStars.slice(0, 5);

  // One-line Plain English Explanations
  const insights: OneLineInsight[] = [];

  // 1. Stars insight
  if (totalStars > 1000) {
    insights.push({
      id: 'stars',
      emoji: '🌟',
      title: `${totalStars.toLocaleString()} total stars`,
      text: 'Exceptional open-source impact with massive community recognition',
      type: 'stars',
    });
  } else if (totalStars > 100) {
    insights.push({
      id: 'stars',
      emoji: '🌟',
      title: `${totalStars.toLocaleString()} total stars`,
      text: 'Shows strong community interest and engagement in your projects',
      type: 'stars',
    });
  } else if (totalStars > 10) {
    insights.push({
      id: 'stars',
      emoji: '🌟',
      title: `${totalStars.toLocaleString()} total stars`,
      text: 'Growing recognition across your open-source repositories',
      type: 'stars',
    });
  } else {
    insights.push({
      id: 'stars',
      emoji: '🌟',
      title: `${totalStars} total stars`,
      text: 'Early-stage project portfolio ready for broader community discovery',
      type: 'stars',
    });
  }

  // 2. Account Age insight
  const yearsStr = accountAgeYears >= 1 ? `${accountAgeYears} years` : `${Math.max(1, Math.floor(accountAgeDays / 30))} months`;
  if (accountAgeYears >= 5) {
    insights.push({
      id: 'age',
      emoji: '📅',
      title: `Active for ${yearsStr}`,
      text: 'Veteran GitHub contributor with long-term open source presence',
      type: 'age',
    });
  } else if (accountAgeYears >= 2) {
    insights.push({
      id: 'age',
      emoji: '📅',
      title: `Active for ${yearsStr}`,
      text: 'Consistent multi-year developer building a track record on GitHub',
      type: 'age',
    });
  } else {
    insights.push({
      id: 'age',
      emoji: '📅',
      title: `Active for ${yearsStr}`,
      text: 'Emerging developer actively creating new projects on GitHub',
      type: 'age',
    });
  }

  // 3. Language insight
  if (languages.length > 0) {
    const topLangObj = languages[0];
    insights.push({
      id: 'language',
      emoji: '🧑‍💻',
      title: `Top language: ${topLangObj.name}`,
      text: `${topLangObj.percentage}% of your code projects rely primarily on ${topLangObj.name}`,
      type: 'language',
    });
  } else {
    insights.push({
      id: 'language',
      emoji: '🧑‍💻',
      title: 'Multidisciplinary repos',
      text: 'Diverse stack with varied language tools across repositories',
      type: 'language',
    });
  }

  // 4. Flagship Repo insight
  if (mostStarredRepo && mostStarredRepo.stargazers_count > 0) {
    insights.push({
      id: 'flagship',
      emoji: '🔥',
      title: `Flagship repo: ${mostStarredRepo.name}`,
      text: `Your top project leading with ${mostStarredRepo.stargazers_count.toLocaleString()} stars`,
      type: 'flagship',
    });
  } else if (repos.length > 0) {
    insights.push({
      id: 'flagship',
      emoji: '🔥',
      title: `Featured repo: ${repos[0].name}`,
      text: 'Your most recently updated primary codebase',
      type: 'flagship',
    });
  }

  // 5. Forks insight
  if (totalForks > 0) {
    insights.push({
      id: 'forks',
      emoji: '🍴',
      title: `${totalForks.toLocaleString()} total forks`,
      text: 'Developers are actively cloning and building upon your codebases',
      type: 'forks',
    });
  }

  // 6. Avg Stars insight
  insights.push({
    id: 'avg_stars',
    emoji: '⚡',
    title: `Avg ${avgStarsPerRepo} stars/repo`,
    text: 'Indicates the average popularity per published repository',
    type: 'avg_stars',
  });

  // 7. Activity insight
  insights.push({
    id: 'activity',
    emoji: '🚀',
    title: `${recentActivityPercentage}% active recently`,
    text: `${recentActivityCount} of ${repos.length} repos updated within the last 12 months`,
    type: 'activity',
  });

  // Synthesize Persona Title & Summary Paragraph
  const { personaTitle, summaryParagraph } = generateSummarySynthesis({
    user,
    reposCount: repos.length,
    totalStars,
    totalForks,
    followers: user.followers,
    accountAgeYears,
    topLanguage,
    languagesCount: languages.length,
    mostStarredRepo,
    avgStarsPerRepo,
    recentActivityPercentage,
  });

  return {
    user,
    repos,
    totalStars,
    totalForks,
    mostStarredRepo,
    mostForkedRepo,
    languages,
    topLanguage,
    avgStarsPerRepo,
    avgForksPerRepo,
    accountAgeYears,
    accountAgeMonths,
    createdDateFormatted,
    recentActivityCount,
    recentActivityPercentage,
    insights,
    personaTitle,
    summaryParagraph,
    topRepos,
    nonForkCount: nonForkRepos.length,
    forkCount: forkRepos.length,
  };
}

interface SummaryInputs {
  user: GitHubUser;
  reposCount: number;
  totalStars: number;
  totalForks: number;
  followers: number;
  accountAgeYears: number;
  topLanguage: string;
  languagesCount: number;
  mostStarredRepo: GitHubRepo | null;
  avgStarsPerRepo: number;
  recentActivityPercentage: number;
}

function generateSummarySynthesis(inputs: SummaryInputs): { personaTitle: string; summaryParagraph: string } {
  const {
    user,
    reposCount,
    totalStars,
    totalForks,
    followers,
    accountAgeYears,
    topLanguage,
    languagesCount,
    mostStarredRepo,
    recentActivityPercentage,
  } = inputs;

  const displayName = user.name || user.login;

  // Persona Determination
  let personaTitle = 'Active GitHub Developer';

  if (totalStars >= 1000 && followers >= 500) {
    personaTitle = 'Open Source Powerhouse & Maintainer';
  } else if (totalStars >= 300) {
    personaTitle = 'Highly Respected Community Builder';
  } else if (languagesCount >= 5) {
    personaTitle = 'Polyglot Software Architect';
  } else if (accountAgeYears >= 5 && reposCount >= 30) {
    personaTitle = 'Veteran Code Contributor';
  } else if (topLanguage !== 'N/A' && languagesCount <= 2 && reposCount >= 10) {
    personaTitle = `${topLanguage} Specialist`;
  } else if (accountAgeYears < 2) {
    personaTitle = 'Emerging Open Source Builder';
  } else if (recentActivityPercentage > 60) {
    personaTitle = 'Prolific Active Maintainer';
  }

  // Summary Construction (3 to 5 sentences)
  const sentences: string[] = [];

  // Sentence 1: Profile & experience overview
  if (accountAgeYears >= 4) {
    sentences.push(
      `${displayName} is a seasoned GitHub contributor with ${accountAgeYears} years of presence on the platform and ${reposCount} public repositories.`
    );
  } else if (accountAgeYears >= 1) {
    sentences.push(
      `${displayName} is an active developer on GitHub for over ${accountAgeYears} years, managing a portfolio of ${reposCount} public repositories.`
    );
  } else {
    sentences.push(
      `${displayName} is a promising developer on GitHub with ${reposCount} public repositories created over their initial account history.`
    );
  }

  // Sentence 2: Tech stack & language focus
  if (topLanguage !== 'N/A' && languagesCount > 3) {
    sentences.push(
      `They demonstrate a versatile polyglot technical stack spanning ${languagesCount} distinct languages, with a primary concentration in ${topLanguage}.`
    );
  } else if (topLanguage !== 'N/A') {
    sentences.push(
      `Their open-source projects display a strong specialization in ${topLanguage}, driving the majority of their codebase implementations.`
    );
  } else {
    sentences.push(`Their repositories showcase a broad range of multi-disciplinary software projects.`);
  }

  // Sentence 3: Stars & flagship project
  if (totalStars > 500 && mostStarredRepo) {
    sentences.push(
      `With over ${totalStars.toLocaleString()} total stars across their work, their flagship project "${mostStarredRepo.name}" serves as a key community milestone.`
    );
  } else if (totalStars > 20 && mostStarredRepo) {
    sentences.push(
      `Their work has earned ${totalStars.toLocaleString()} stars on GitHub, highlighted by their most popular project "${mostStarredRepo.name}".`
    );
  } else if (followers > 20) {
    sentences.push(
      `They maintain an active follower base of ${followers.toLocaleString()} developers, reflecting steady community connections.`
    );
  } else {
    sentences.push(
      `They continue to expand their open-source footprint with steady project releases and ongoing repository updates.`
    );
  }

  // Sentence 4: Recent activity & ongoing momentum
  if (recentActivityPercentage >= 50) {
    sentences.push(
      `With ${recentActivityPercentage}% of their repositories updated within the last year, they show exceptional ongoing development momentum.`
    );
  } else if (totalForks > 10) {
    sentences.push(
      `Their codebases have been forked ${totalForks.toLocaleString()} times, showing real-world utility for fellow engineers.`
    );
  } else {
    sentences.push(
      `Overall, their profile reflects a growing dedication to open source collaboration and practical code building.`
    );
  }

  return {
    personaTitle,
    summaryParagraph: sentences.join(' '),
  };
}

export function compareProfiles(p1: AnalyzedProfile, p2: AnalyzedProfile): ComparisonData {
  const metrics: ComparisonMetric[] = [
    {
      label: 'Public Repositories',
      user1Val: p1.user.public_repos,
      user2Val: p2.user.public_repos,
      winner: p1.user.public_repos > p2.user.public_repos ? 1 : p1.user.public_repos < p2.user.public_repos ? 2 : 0,
      format: 'number',
    },
    {
      label: 'Total Stars Received',
      user1Val: p1.totalStars,
      user2Val: p2.totalStars,
      winner: p1.totalStars > p2.totalStars ? 1 : p1.totalStars < p2.totalStars ? 2 : 0,
      format: 'number',
    },
    {
      label: 'Total Forks Received',
      user1Val: p1.totalForks,
      user2Val: p2.totalForks,
      winner: p1.totalForks > p2.totalForks ? 1 : p1.totalForks < p2.totalForks ? 2 : 0,
      format: 'number',
    },
    {
      label: 'Followers Count',
      user1Val: p1.user.followers,
      user2Val: p2.user.followers,
      winner: p1.user.followers > p2.user.followers ? 1 : p1.user.followers < p2.user.followers ? 2 : 0,
      format: 'number',
    },
    {
      label: 'Avg Stars per Repo',
      user1Val: p1.avgStarsPerRepo,
      user2Val: p2.avgStarsPerRepo,
      winner: p1.avgStarsPerRepo > p2.avgStarsPerRepo ? 1 : p1.avgStarsPerRepo < p2.avgStarsPerRepo ? 2 : 0,
      format: 'number',
    },
    {
      label: 'Account Started Date',
      user1Val: p1.createdDateFormatted,
      user2Val: p2.createdDateFormatted,
      winner: p1.accountAgeYears > p2.accountAgeYears ? 1 : p1.accountAgeYears < p2.accountAgeYears ? 2 : 0,
      format: 'string',
    },
    {
      label: 'Account Age (Years)',
      user1Val: `${p1.accountAgeYears}y`,
      user2Val: `${p2.accountAgeYears}y`,
      winner: p1.accountAgeYears > p2.accountAgeYears ? 1 : p1.accountAgeYears < p2.accountAgeYears ? 2 : 0,
      format: 'string',
    },
    {
      label: 'Recent Activity Rate',
      user1Val: `${p1.recentActivityPercentage}%`,
      user2Val: `${p2.recentActivityPercentage}%`,
      winner: p1.recentActivityPercentage > p2.recentActivityPercentage ? 1 : p1.recentActivityPercentage < p2.recentActivityPercentage ? 2 : 0,
      format: 'string',
    },
  ];

  let p1Score = 0;
  let p2Score = 0;

  metrics.forEach((m) => {
    if (m.winner === 1) p1Score++;
    if (m.winner === 2) p2Score++;
  });

  const name1 = p1.user.name || p1.user.login;
  const name2 = p2.user.name || p2.user.login;

  let verdict = '';
  if (p1Score > p2Score) {
    verdict = `${name1} takes the lead with superior performance across ${p1Score} of ${metrics.length} key metrics, driven by stronger open-source reach.`;
  } else if (p2Score > p1Score) {
    verdict = `${name2} takes the lead with superior performance across ${p2Score} of ${metrics.length} key metrics, showing higher activity and engagement.`;
  } else {
    verdict = `It's a tie! Both ${name1} and ${name2} demonstrate complementary strengths across their GitHub profiles.`;
  }

  return {
    profile1: p1,
    profile2: p2,
    metrics,
    verdict,
  };
}
