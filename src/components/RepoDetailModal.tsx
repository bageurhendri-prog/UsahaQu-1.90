import React, { useEffect, useState } from 'react';
import { GitHubRepo } from '../types/github';
import { getLanguageColor, formatRelativeTime } from '../utils/languageColors';
import { fetchRepoReadme } from '../services/githubService';
import { 
  X, 
  Star, 
  GitFork, 
  ExternalLink, 
  Github, 
  Terminal, 
  Check, 
  Copy, 
  Scale, 
  Clock, 
  FileText, 
  AlertCircle,
  GitBranch,
  Layers,
  Sparkles
} from 'lucide-react';

interface RepoDetailModalProps {
  repo: GitHubRepo | null;
  onClose: () => void;
  onSelectTopic?: (topic: string) => void;
}

export const RepoDetailModal: React.FC<RepoDetailModalProps> = ({
  repo,
  onClose,
  onSelectTopic,
}) => {
  const [readmeContent, setReadmeContent] = useState<string>('');
  const [loadingReadme, setLoadingReadme] = useState<boolean>(false);
  const [copiedClone, setCopiedClone] = useState<boolean>(false);

  useEffect(() => {
    if (!repo) return;

    setReadmeContent('');
    setLoadingReadme(true);

    const [owner, repoName] = repo.full_name.split('/');
    fetchRepoReadme(owner || 'bageurhendri', repoName || repo.name)
      .then((text) => setReadmeContent(text))
      .catch(() => setReadmeContent('Gagal memuat README.md.'))
      .finally(() => setLoadingReadme(false));

    // Handle ESC key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [repo, onClose]);

  if (!repo) return null;

  const cloneCommand = `git clone ${repo.html_url}.git`;
  const langColor = getLanguageColor(repo.language);

  const handleCopy = () => {
    navigator.clipboard.writeText(cloneCommand);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/40 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                {repo.full_name}
              </span>
              {repo.homepage && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                  Live Demo Available
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {repo.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          
          {/* Description */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <p className="leading-relaxed text-sm">
              {repo.description || 'Tidak ada deskripsi rinci untuk repositori ini.'}
            </p>
          </div>

          {/* Quick Clone Terminal Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-500" />
              <span>Clone Repositori:</span>
            </label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs border border-slate-800 shadow-inner">
              <span className="truncate select-all">{cloneCommand}</span>
              <button
                onClick={handleCopy}
                className="ml-3 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-semibold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
              >
                {copiedClone ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedClone ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Bahasa Utama</div>
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mt-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langColor }} />
                <span>{repo.language || 'Tidak Terdeteksi'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Bintang & Forks</div>
              <div className="flex items-center gap-3 font-bold text-slate-900 dark:text-white mt-1">
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {repo.stargazers_count}
                </span>
                <span className="flex items-center gap-1 text-blue-500">
                  <GitFork className="w-3.5 h-3.5" />
                  {repo.forks_count}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Default Branch</div>
              <div className="flex items-center gap-1.5 font-mono font-semibold text-slate-800 dark:text-slate-200 mt-1">
                <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                <span>{repo.default_branch}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Lisensi</div>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate">
                <Scale className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{repo.license?.spdx_id || repo.license?.name || 'Belum Ditentukan'}</span>
              </div>
            </div>
          </div>

          {/* Topics */}
          {repo.topics && repo.topics.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-500" />
                <span>Topik & Tagar Terkait:</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {repo.topics.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      if (onSelectTopic) onSelectTopic(t);
                      onClose();
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-mono bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/40 transition cursor-pointer"
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* README Section */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>README.md Preview:</span>
              </label>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800 whitespace-pre-wrap max-h-72 leading-relaxed">
              {loadingReadme ? (
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <span>Memuat isi README.md dari GitHub...</span>
                </div>
              ) : (
                readmeContent || 'Tidak ada konten README.md.'
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40 shrink-0">
          <div className="text-xs text-slate-400 font-mono">
            Diperbarui: {formatRelativeTime(repo.updated_at)}
          </div>

          <div className="flex items-center gap-2">
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 flex items-center gap-2 transition"
              >
                <span>Buka Live Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-900 text-white flex items-center gap-2 transition"
            >
              <Github className="w-4 h-4" />
              <span>Buka di GitHub</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
