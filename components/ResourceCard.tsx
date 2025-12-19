
import React, { useState } from 'react';
import { Resource } from '../types';
import { getSmartSummary } from '../services/gemini';

interface ResourceCardProps {
  resource: Resource;
  onDelete?: () => void;
  onEdit?: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onDelete, onEdit }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const handleAISummary = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (summary) {
      setShowSummary(!showSummary);
      return;
    }
    setLoading(true);
    const result = await getSmartSummary(resource.title, resource.description);
    setSummary(result);
    setLoading(false);
    setShowSummary(true);
  };

  return (
    <div className={`group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 transition-all duration-300 hover:border-zinc-600 hover:bg-zinc-800/80 ${resource.featured ? 'md:col-span-1' : ''}`}>
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {onEdit && (
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 p-1.5 rounded-lg transition-colors shadow-lg"
            title="编辑"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
        {onDelete && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-lg transition-colors shadow-lg"
            title="删除"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="flex justify-between items-start mb-4">
        <div className="text-3xl bg-zinc-800 w-12 h-12 flex items-center justify-center rounded-xl transition-transform group-hover:scale-110 duration-300">
          {resource.icon}
        </div>
        <a 
          href={resource.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-zinc-500 hover:text-white transition-colors p-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      <h3 className="text-xl font-semibold mb-2 text-zinc-100 group-hover:text-white transition-colors">
        {resource.title}
      </h3>
      <p className="text-zinc-400 text-sm leading-relaxed mb-4 min-h-[3rem] line-clamp-3">
        {resource.description || '暂无详细描述'}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {resource.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-zinc-800 text-zinc-500 text-[10px] rounded-md border border-zinc-700 uppercase tracking-wider">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <button 
          onClick={handleAISummary}
          className="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors group/btn"
        >
          {loading ? (
            <span className="flex items-center gap-1">
              <svg className="animate-spin h-3 w-3 text-purple-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              分析中...
            </span>
          ) : (
            <span className="flex items-center gap-1">
               <svg className="w-3.5 h-3.5 group-hover/btn:scale-125 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              {showSummary ? '收起总结' : 'AI 洞察'}
            </span>
          )}
        </button>
        <span className="text-[10px] text-zinc-600 font-mono tracking-tighter opacity-50">
          {resource.category}
        </span>
      </div>

      {showSummary && summary && (
        <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300 shadow-inner">
          <p className="text-[11px] text-purple-200/90 leading-relaxed italic">
            {summary}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResourceCard;
