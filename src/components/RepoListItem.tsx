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
  Clock
} from 'lucide-react';

interface RepoListItemProps {
  repo: GitHubRepo;
  onSelect: (repo: GitHubRepo) => void;
}

export const RepoListItem: React.FC<RepoListItemProps> = ({ repo, onSelect }) => {
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
      className="group bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 p-4 shadow-xs hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        
        {/* Name & language */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
            {repo.name}
          </h3>

          {repo.language && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: langColor }}
              />
              {repo.language}
            </span>
          )}

          {repo.homepage && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
              Demo
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">
          {repo.description || 'Tidak ada deskripsi.'}
        </p>

      </div>

      {/* Stats and actions */}
      <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 text-xs">
        
        {/* Stars and forks */}
        <div className="flex items-center gap-3 font-mono text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            {repo.stargazers_count}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="w-3.5 h-3.5" />
            {repo.forks_count}
          </span>
          <span className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="w-3 h-3" />
            {formatRelativeTime(repo.updated_at)}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyClone}
            title="Salin git clone"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Terminal className="w-3.5 h-3.5" />}
          </button>

          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Buka Demo"
              className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

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
