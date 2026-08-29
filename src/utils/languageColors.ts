const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  PHP: '#4F5D95',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  R: '#198CE7',
  Scala: '#c22d40',
  Elixir: '#6e4a7e',
  Haskell: '#5e5086',
  Lua: '#000080',
  Jupyter: '#DA5B0B',
  'Jupyter Notebook': '#DA5B0B',
  Zig: '#ec915c',
  OCaml: '#3be133',
  Docker: '#384d54',
  Dockerfile: '#384d54',
  Makefile: '#427819',
};

const FALLBACK_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
  '#eab308', '#84cc16', '#10b981', '#06b6d4', '#0ea5e9'
];

export function getLanguageColor(language: string | null): string {
  if (!language) return '#9ca3af';
  if (LANGUAGE_COLORS[language]) {
    return LANGUAGE_COLORS[language];
  }
  // Deterministic fallback color based on string hash
  let hash = 0;
  for (let i = 0; i < language.length; i++) {
    hash = language.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % FALLBACK_COLORS.length;
  return FALLBACK_COLORS[index];
}
