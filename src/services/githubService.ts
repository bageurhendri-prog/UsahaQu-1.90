import { GitHubRepo, GitHubUser } from '../types/github';
import { DEFAULT_MOCK_REPOS, DEFAULT_MOCK_USER } from '../data/mockData';

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

export function getStoredUsername(): string {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const queryUser = params.get('user') || params.get('u');
    if (queryUser) return queryUser.trim();

    const stored = localStorage.getItem('gh_portfolio_username');
    if (stored) return stored.trim();
  }
  return 'bageurhendri';
}

export function saveStoredUsername(username: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('gh_portfolio_username', username.trim());
  }
}

export function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('gh_portfolio_token');
  }
  return null;
}

export function saveStoredToken(token: string | null): void {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('gh_portfolio_token', token.trim());
    } else {
      localStorage.removeItem('gh_portfolio_token');
    }
  }
}

export async function fetchGitHubUser(
  username: string,
  token?: string | null
): Promise<{ user: GitHubUser; isFallback: boolean; rateLimitExceeded: boolean }> {
  const cacheKey = `gh_user_${username.toLowerCase()}`;
  
  // Check local cache
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed: CacheEntry<GitHubUser> = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
          return { user: parsed.data, isFallback: false, rateLimitExceeded: false };
        }
      }
    } catch {
      // ignore JSON parse error
    }
  }

  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };
  const activeToken = token || getStoredToken();
  if (activeToken) {
    headers['Authorization'] = `token ${activeToken}`;
  }

  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers });
    
    if (res.status === 403 || res.status === 429) {
      console.warn('GitHub API rate limit exceeded');
      if (username.toLowerCase() === 'bageurhendri') {
        return { user: DEFAULT_MOCK_USER, isFallback: true, rateLimitExceeded: true };
      }
      throw new Error('Rate limit GitHub terlampaui. Gunakan Personal Access Token di pengaturan atau coba lagi nanti.');
    }

    if (!res.ok) {
      throw new Error(`Gagal mengambil profil GitHub (${res.status} ${res.statusText})`);
    }

    const userData: GitHubUser = await res.json();
    
    // Save to cache
    if (typeof window !== 'undefined') {
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: userData }));
    }

    return { user: userData, isFallback: false, rateLimitExceeded: false };
  } catch (err) {
    console.error('fetchGitHubUser error:', err);
    if (username.toLowerCase() === 'bageurhendri') {
      return { user: DEFAULT_MOCK_USER, isFallback: true, rateLimitExceeded: false };
    }
    throw err;
  }
}

export async function fetchGitHubRepos(
  username: string,
  token?: string | null
): Promise<{ repos: GitHubRepo[]; isFallback: boolean; rateLimitExceeded: boolean }> {
  const cacheKey = `gh_repos_${username.toLowerCase()}`;
  
  // Check local cache
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed: CacheEntry<GitHubRepo[]> = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
          return { repos: parsed.data, isFallback: false, rateLimitExceeded: false };
        }
      }
    } catch {
      // ignore JSON parse error
    }
  }

  const headers: HeadersInit = {
    Accept: 'application/vnd.github.mercy-preview+json', // Enables topics preview
  };
  const activeToken = token || getStoredToken();
  if (activeToken) {
    headers['Authorization'] = `token ${activeToken}`;
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
      { headers }
    );

    if (res.status === 403 || res.status === 429) {
      console.warn('GitHub API rate limit exceeded for repos');
      if (username.toLowerCase() === 'bageurhendri') {
        return { repos: DEFAULT_MOCK_REPOS, isFallback: true, rateLimitExceeded: true };
      }
      throw new Error('Rate limit GitHub terlampaui. Tambahkan GitHub Token di menu pengaturan.');
    }

    if (!res.ok) {
      throw new Error(`Gagal memuat repositori (${res.status} ${res.statusText})`);
    }

    const reposData: GitHubRepo[] = await res.json();

    // Cache results
    if (typeof window !== 'undefined') {
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: reposData }));
    }

    return { repos: reposData, isFallback: false, rateLimitExceeded: false };
  } catch (err) {
    console.error('fetchGitHubRepos error:', err);
    if (username.toLowerCase() === 'bageurhendri') {
      return { repos: DEFAULT_MOCK_REPOS, isFallback: true, rateLimitExceeded: false };
    }
    throw err;
  }
}

export async function fetchRepoReadme(owner: string, repo: string, token?: string | null): Promise<string> {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.raw',
  };
  const activeToken = token || getStoredToken();
  if (activeToken) {
    headers['Authorization'] = `token ${activeToken}`;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
    if (!res.ok) {
      return 'Tidak ada file README.md di repositori ini.';
    }
    return await res.text();
  } catch (err) {
    return 'Gagal memuat isi README.md.';
  }
}
