import React, { useState } from 'react';
import { GitHubRepo } from '../types/github';
import { getLanguageColor, formatRelativeTime } from '../utils/languageColors';
import { 
  Star, 
  GitFork, 
  ExternalLink, 
  Github, 
  Terminal, 
  Check, 
  Copy, 
  Scale, 
  Clock, 
  BookOpen,
  ArrowUpRight
} from 'lucide-react';

interface RepoCardProps {
  repo: GitHubRepo;
  onSelect: (repo: GitHubRepo) => void;
}

export const RepoCard: React.FC<RepoCardProps> = ({ repo, onSelect }) => {
  const [copied, setCopied] = useState(false);
  const langColor = getLanguageColor(repo.language);

  const handleCopyClone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`git clone ${repo.html_url}.git`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={() => onSelect(repo)}
      className="group relative bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs hover:shadow-xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-200 flex flex-col justify-between cursor-pointer"
    >
      <div>
        
        {/* Top Badges & Stars */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            {repo.language ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: langColor }}
                />
                {repo.language}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 font-mono">Repo</span>
            )}

            {repo.fork && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-500">
                Forked
              </span>
            )}

            {repo.homepage && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                Demo
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

        {/* Title */}
        <div className="flex items-start justify-between gap-1 group">
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
            {repo.name}
          </h3>
          <ArrowUpRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
          {repo.description || 'Tidak ada deskripsi repositori.'}
        </p>

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {repo.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800"
              >
                #{topic}
              </span>
            ))}
            {repo.topics.length > 3 && (
              <span className="text-[10px] font-mono text-slate-400 self-center">
                +{repo.topics.length - 3}
              </span>
            )}
          </div>
        )}

      </div>

      {/* Meta Footer */}
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2 text-xs">
        
        {/* Updated & License */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1" title={repo.updated_at}>
            <Clock className="w-3 h-3" />
            <span>{formatRelativeTime(repo.updated_at)}</span>
          </span>
          {repo.license && (
            <span className="hidden sm:flex items-center gap-1" title={repo.license.name}>
              <Scale className="w-3 h-3" />
              <span>{repo.license.spdx_id || repo.license.key}</span>
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {/* Quick clone */}
          <button
            onClick={handleCopyClone}
            title="Salin git clone"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Terminal className="w-3.5 h-3.5" />}
          </button>

          {/* Live demo */}
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Buka Demo Online"
              className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* GitHub link */}
          <a
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Buka di GitHub"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <Github className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

    </div>
  );
};
