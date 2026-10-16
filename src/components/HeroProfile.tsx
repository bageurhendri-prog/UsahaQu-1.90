import React from 'react';
import { GitHubRepo, GitHubUser } from '../types/github';
import { getLanguageColor } from '../utils/languageColors';
import { 
  MapPin, 
  Building2, 
  Globe, 
  Mail, 
  Github, 
  Star, 
  GitFork, 
  Users, 
  FolderGit2, 
  RefreshCw, 
  MessageSquare,
  AlertCircle,
  ExternalLink,
  KeyRound
} from 'lucide-react';

interface HeroProfileProps {
  user: GitHubUser;
  repos: GitHubRepo[];
  isFallback: boolean;
  rateLimitExceeded: boolean;
  onRefresh: () => void;
  onOpenSettings: () => void;
  isLoading: boolean;
}

export const HeroProfile: React.FC<HeroProfileProps> = ({
  user,
  repos,
  isFallback,
  rateLimitExceeded,
  onRefresh,
  onOpenSettings,
  isLoading,
}) => {
  // Compute aggregate statistics
  const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((acc, r) => acc + (r.forks_count || 0), 0);

  // Compute language distribution
  const langCounts: Record<string, number> = {};
  repos.forEach((r) => {
    if (r.language) {
      langCounts[r.language] = (langCounts[r.language] || 0) + 1;
    }
  });

  const totalLanguagesCounted = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1;
  const sortedLanguages = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / totalLanguagesCounted) * 100),
      color: getLanguageColor(name),
    }));

  return (
    <section className="relative overflow-hidden py-10 sm:py-14 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 via-white to-white dark:from-slate-900/60 dark:via-slate-900 dark:to-slate-950">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute -top-20 left-1/4 w-80 h-80 bg-emerald-400 rounded-full blur-[100px]" />
        <div className="absolute -top-10 right-1/4 w-80 h-80 bg-teal-400 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Rate limit warning banner */}
        {rateLimitExceeded && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-200 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                <b>GitHub Public API Rate Limit</b>: Menampilkan data cache/demo untuk user <code className="font-mono font-bold bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded">@{user.login}</code>.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSettings}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Pasang Token</span>
              </button>
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="px-3 py-1.5 bg-white dark:bg-amber-900/40 hover:bg-amber-100 dark:hover:bg-amber-900/80 text-amber-800 dark:text-amber-300 font-medium rounded-lg text-xs border border-amber-300 dark:border-amber-700 flex items-center gap-1.5 transition cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Coba Lagi</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Profile Info Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Avatar & Identity */}
          <div className="lg:col-span-8 flex flex-col sm:flex-row gap-6 items-start">
            
            {/* Avatar with Status Ring */}
            <div className="relative shrink-0 group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-xl shadow-emerald-500/10 p-1 bg-white dark:bg-slate-800">
                <img
                  src={user.avatar_url}
                  alt={user.name || user.login}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback avatar
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.login)}&background=059669&color=fff&size=200`;
                  }}
                />
              </div>
              <span 
                title="Tersedia untuk proyek & kolaborasi"
                className="absolute -bottom-1 -right-1 flex h-4 w-4"
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
              </span>
            </div>

            {/* Texts & Bios */}
            <div className="space-y-3 flex-1">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {user.name || user.login}
                  </h1>
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    @{user.login}
                  </span>
                </div>
                
                <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  Fullstack & Offline-First Architect &bull; UsahaQu Creator
                </p>
              </div>

              {/* Bio description */}
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {user.bio || 'Menghadirkan aplikasi web modern, offline-first, dan solusi perangkat lunak ramah pengguna langsung dari repositori open-source GitHub.'}
              </p>

              {/* Metadata Items */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                {user.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.company && (
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{user.company}</span>
                  </div>
                )}
                {user.blog && (
                  <a
                    href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                  >
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>{user.blog.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {user.email && (
                  <a
                    href={`mailto:${user.email}`}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{user.email}</span>
                  </a>
                )}
                
                <a
                  href={`https://wa.me/6281234567890?text=${encodeURIComponent('Halo, saya melihat portofolio proyek GitHub Anda dan ingin berdiskusi.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/60 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Profil GitHub</span>
                </a>

                <button
                  onClick={onRefresh}
                  disabled={isLoading}
                  title="Sinkronisasi data terbaru dari GitHub"
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-500' : ''}`} />
                </button>
              </div>

            </div>
          </div>

          {/* Right Statistics Box */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Statistik GitHub
              </span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                Live Synced
              </span>
            </div>

            {/* Stats 2x2 Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <FolderGit2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Repositori</span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {user.public_repos || repos.length}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  <span>Total Bintang</span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {totalStars}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <GitFork className="w-3.5 h-3.5 text-blue-500" />
                  <span>Total Forks</span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {totalForks}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Users className="w-3.5 h-3.5 text-purple-500" />
                  <span>Followers</span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {user.followers}
                </div>
              </div>
            </div>

            {/* Language distribution bar */}
            {sortedLanguages.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Bahasa Pemrograman Utama</span>
                  <span className="text-[11px] font-mono text-slate-400">{sortedLanguages.length} terdeteksi</span>
                </div>

                {/* Multi-segment progress bar */}
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                  {sortedLanguages.map((lang) => (
                    <div
                      key={lang.name}
                      style={{
                        width: `${lang.percent}%`,
                        backgroundColor: lang.color,
                      }}
                      title={`${lang.name}: ${lang.percent}% (${lang.count} repos)`}
                      className="h-full first:rounded-l-full last:rounded-r-full transition-all"
                    />
                  ))}
                </div>

                {/* Language Legend */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-[11px]">
                  {sortedLanguages.map((lang) => (
                    <span key={lang.name} className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: lang.color }}
                      />
                      <span>{lang.name}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{lang.percent}%</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
