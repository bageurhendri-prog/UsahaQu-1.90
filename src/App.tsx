import React, { useEffect, useMemo, useState } from 'react';
import { 
  GitHubRepo, 
  GitHubUser, 
  FilterState, 
  ViewMode 
} from './types/github';
import { 
  fetchGitHubRepos, 
  fetchGitHubUser, 
  getStoredUsername 
} from './services/githubService';
import { Navbar } from './components/Navbar';
import { HeroProfile } from './components/HeroProfile';
import { FeaturedShowcase } from './components/FeaturedShowcase';
import { RepoFilter } from './components/RepoFilter';
import { RepoCard } from './components/RepoCard';
import { RepoListItem } from './components/RepoListItem';
import { RepoDetailModal } from './components/RepoDetailModal';
import { DeployGuideModal } from './components/DeployGuideModal';
import { UserConfigModal } from './components/UserConfigModal';
import { Footer } from './components/Footer';
import { FolderX, Loader2 } from 'lucide-react';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gh_portfolio_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Current GitHub account
  const [username, setUsername] = useState<string>(() => getStoredUsername());

  // Data states
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [rateLimitExceeded, setRateLimitExceeded] = useState<boolean>(false);

  // Modals state
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // View & Filter states
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    language: '',
    topic: '',
    sortBy: 'stars',
    onlyWithDemo: false,
    includeForks: false,
    includeArchived: false,
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('gh_portfolio_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('gh_portfolio_theme', 'light');
    }
  }, [darkMode]);

  // Load GitHub data
  const loadData = async (targetUser: string) => {
    setLoading(true);
    setRateLimitExceeded(false);

    try {
      const [userRes, reposRes] = await Promise.all([
        fetchGitHubUser(targetUser),
        fetchGitHubRepos(targetUser),
      ]);

      setUser(userRes.user);
      setRepos(reposRes.repos);
      setIsFallback(userRes.isFallback || reposRes.isFallback);
      setRateLimitExceeded(userRes.rateLimitExceeded || reposRes.rateLimitExceeded);
    } catch (err) {
      console.error('Error loading GitHub data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(username);
  }, [username]);

  // Language counts
  const availableLanguages = useMemo(() => {
    const counts: Record<string, number> = {};
    repos.forEach((r) => {
      if (r.language) {
        counts[r.language] = (counts[r.language] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [repos]);

  // Topics counts
  const availableTopics = useMemo(() => {
    const counts: Record<string, number> = {};
    repos.forEach((r) => {
      if (r.topics && Array.isArray(r.topics)) {
        r.topics.forEach((t) => {
          counts[t] = (counts[t] || 0) + 1;
        });
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [repos]);

  // Filtered and sorted repositories
  const filteredRepos = useMemo(() => {
    return repos
      .filter((repo) => {
        // Exclude forks unless enabled
        if (!filters.includeForks && repo.fork) return false;

        // Exclude archived if needed
        if (!filters.includeArchived && repo.archived) return false;

        // Only with demo
        if (filters.onlyWithDemo && !repo.homepage) return false;

        // Language filter
        if (filters.language && repo.language !== filters.language) return false;

        // Topic filter
        if (filters.topic && (!repo.topics || !repo.topics.includes(filters.topic))) {
          return false;
        }

        // Search keyword
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchName = repo.name.toLowerCase().includes(q);
          const matchDesc = (repo.description || '').toLowerCase().includes(q);
          const matchTopic = repo.topics?.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchTopic) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'stars') {
          return (b.stargazers_count || 0) - (a.stargazers_count || 0);
        }
        if (filters.sortBy === 'forks') {
          return (b.forks_count || 0) - (a.forks_count || 0);
        }
        if (filters.sortBy === 'updated') {
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        }
        if (filters.sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [repos, filters]);

  const handleApplyNewUser = (newUser: string) => {
    setUsername(newUser);
  };

  const handleSelectTopicFromModal = (topic: string) => {
    setFilters((prev) => ({ ...prev, topic }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased transition-colors duration-200" id="top">
      
      {/* Navigation Bar */}
      <Navbar
        user={user}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isFallback={isFallback}
      />

      <main className="flex-1">
        
        {/* Loading state skeleton */}
        {loading && !user ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Menghubungkan ke GitHub...
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Mengambil profil & repositori @{username}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Hero Profile Banner */}
            {user && (
              <HeroProfile
                user={user}
                repos={repos}
                isFallback={isFallback}
                rateLimitExceeded={rateLimitExceeded}
                onRefresh={() => loadData(username)}
                onOpenSettings={() => setIsSettingsOpen(true)}
                isLoading={loading}
              />
            )}

            {/* Featured Projects Highlight */}
            {repos.length > 0 && !filters.search && !filters.language && !filters.topic && (
              <FeaturedShowcase
                repos={repos}
                onSelectRepo={(r) => setSelectedRepo(r)}
              />
            )}

            {/* Repositories Explorer Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
              
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Daftar Repositori Proyek
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Koleksi proyek open source, modul engine, dan karya kode terpublikasi
                  </p>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <RepoFilter
                filters={filters}
                onFilterChange={setFilters}
                availableLanguages={availableLanguages}
                availableTopics={availableTopics}
                totalCount={repos.length}
                filteredCount={filteredRepos.length}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />

              {/* Repository Cards / List */}
              {filteredRepos.length === 0 ? (
                <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900/60 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <FolderX className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    Tidak ada repositori yang cocok
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Coba sesuaikan kata kunci pencarian, pilih bahasa pemrograman lain, atau bersihkan filter.
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        search: '',
                        language: '',
                        topic: '',
                        sortBy: 'stars',
                        onlyWithDemo: false,
                        includeForks: false,
                        includeArchived: false,
                      })
                    }
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    Reset Semua Filter
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredRepos.map((repo) => (
                    <RepoCard
                      key={repo.id}
                      repo={repo}
                      onSelect={(r) => setSelectedRepo(r)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredRepos.map((repo) => (
                    <RepoListItem
                      key={repo.id}
                      repo={repo}
                      onSelect={(r) => setSelectedRepo(r)}
                    />
                  ))}
                </div>
              )}

            </section>
          </>
        )}

      </main>

      {/* Footer */}
      <Footer
        user={user}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
      />

      {/* Detail Modal */}
      <RepoDetailModal
        repo={selectedRepo}
        onClose={() => setSelectedRepo(null)}
        onSelectTopic={handleSelectTopicFromModal}
      />

      {/* Deploy to GitHub Pages Guide Modal */}
      <DeployGuideModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
        username={username}
      />

      {/* Change User / Settings Modal */}
      <UserConfigModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUsername={username}
        onApplyConfig={handleApplyNewUser}
      />

    </div>
  );
}
