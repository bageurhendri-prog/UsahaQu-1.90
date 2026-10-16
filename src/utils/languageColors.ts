export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  React: '#61dafb',
  PHP: '#4F5D95',
  Java: '#b07219',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Swift: '#F05138',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C#': '#178600',
  'C++': '#f34b7d',
  C: '#555555',
  Shell: '#89e051',
  Ruby: '#701516',
  Sass: '#a53b70',
  SCSS: '#c6538c',
  Jupyter: '#DA5B0B',
};

export function getLanguageColor(language: string | null): string {
  if (!language) return '#94a3b8';
  return LANGUAGE_COLORS[language] || '#10b981';
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours <= 0) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return diffMins <= 1 ? 'baru saja' : `${diffMins} menit lalu`;
      }
      return `${diffHours} jam lalu`;
    }
    if (diffDays === 1) return 'kemarin';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`;
    return `${Math.floor(diffDays / 365)} tahun lalu`;
  } catch {
    return dateString;
  }
}

export function formatCompactNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}
