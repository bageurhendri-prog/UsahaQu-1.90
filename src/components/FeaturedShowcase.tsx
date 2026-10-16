import React, { useState } from 'react';
import { GitHubRepo } from '../types/github';
import { getLanguageColor } from '../utils/languageColors';
import { 
  Sparkles, 
  Star, 
  GitFork, 
  ExternalLink, 
  Github, 
  Terminal, 
  Check, 
  Copy,
  BookOpen
} from 'lucide-react';

interface FeaturedShowcaseProps {
  repos: GitHubRepo[];
  onSelectRepo: (repo: GitHubRepo) => void;
}

export const FeaturedShowcase: React.FC<FeaturedShowcaseProps> = ({
  repos,
  onSelectRepo,
}) => {
  const [copiedCloneId, setCopiedCloneId] = useState<number | null>(null);

  // Take top 3 repos (either with most stars or with homepage live demo)
  const featured = [...repos]
    .sort((a, b) => {
      // prioritize repos with homepage, then stargazers
      const aScore = (a.homepage ? 50 : 0) + (a.stargazers_count || 0);
      const bScore = (b.homepage ? 50 : 0) + (b.stargazers_count || 0);
      return bScore - aScore;
    })
    .slice(0, 3);

  if (featured.length === 0) return null;

  const handleCopyClone = (e: React.MouseEvent, repo: GitHubRepo) => {
    e.stopPropagation();
    const command = `git clone ${repo.html_url}.git`;
    navigator.clipboard.writeText(command);
    setCopiedCloneId(repo.id);
    setTimeout(() => setCopiedCloneId(null), 2000);
  };

  return (
    <section className="py-10 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Proyek Unggulan (Featured Projects)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Karya dan arsitektur repositori open source pilihan
              </p>
            </div>
          </div>
        </div>

        {/* 3 Columns Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((repo) => {
            const langColor = getLanguageColor(repo.language);
            const isCopied = copiedCloneId === repo.id;

            return (
              <div
                key={repo.id}
                onClick={() => onSelectRepo(repo)}
                className="group relative bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Glow accent */}
                <div className="absolute inset-x-0 -top-px h-1 rounded-t-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Top Bar: Language & Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      {repo.language && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: langColor }}
                          />
                          {repo.language}
                        </span>
                      )}
                      {repo.homepage && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                          Live Demo
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                      <span className="flex items-center gap-1 hover:text-amber-500 transition">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3.5 h-3.5" />
                        {repo.forks_count}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {repo.name}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {repo.description || 'Tidak ada deskripsi pada repositori ini.'}
                  </p>

                  {/* Topics tag pills */}
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {repo.topics.slice(0, 4).map((topic) => (
                        <span
                          key={topic}
                          className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                  
                  {/* Clone shortcut */}
                  <button
                    onClick={(e) => handleCopyClone(e, repo)}
                    title="Salin git clone command"
                    className="inline-flex items-center gap-1.5 text-xs font-mono py-1.5 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                  >
                    <Terminal className="w-3 h-3 text-slate-400" />
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span className="text-[11px]">Clone</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    {repo.homepage && (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                      >
                        <span>Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title="Buka di GitHub"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    >
                      <Github className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => onSelectRepo(repo)}
                      title="Lihat README & Detail"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
