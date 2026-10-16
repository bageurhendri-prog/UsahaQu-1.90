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

export interface GitHubLicense {
  key: string;
  name: string;
  spdx_id: string;
  url: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  license: GitHubLicense | null;
  topics?: string[];
  default_branch: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  archived?: boolean;
}

export type SortOption = 'stars' | 'updated' | 'forks' | 'name';
export type ViewMode = 'grid' | 'list';
export type AccentColor = 'emerald' | 'cyan' | 'indigo' | 'amber' | 'rose';

export interface FilterState {
  search: string;
  language: string;
  topic: string;
  sortBy: SortOption;
  onlyWithDemo: boolean;
  includeForks: boolean;
  includeArchived: boolean;
}

export interface PortfolioConfig {
  username: string;
  customTitle?: string;
  customBio?: string;
  contactEmail?: string;
  contactWhatsapp?: string;
  githubToken?: string;
  pinnedRepoNames: string[];
}
