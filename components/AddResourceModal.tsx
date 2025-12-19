
import React, { useState, useEffect } from 'react';
import { Category, Resource } from '../types';
import { CATEGORIES } from '../constants';
import { generateAIDescription } from '../services/gemini';

const EMOJI_LIST = ['🤖', '✨', '💬', '📚', '🚀', '📐', '🎯', '📝', '⚡', '🔍', '📉', '🖼️', '🎨', '🛠️', '🔗', '🌐', '🧠', '💻', '💡', '🔥'];

interface AddResourceModalProps {
  onClose: () => void;
  onSave: (resource: Omit<Resource, 'id'> & { id?: string }) => void;
  initialData?: Resource | null;
}

const AddResourceModal: React.FC<AddResourceModalProps> = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: 'AI' as Category,
    icon: '🔗',
    tags: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        url: initialData.url,
        description: initialData.description,
        category: initialData.category,
        icon: initialData.icon,
        tags: initialData.tags.join(', '),
      });
    }
  }, [initialData]);

  const handleAISuggestDescription = async () => {
    if (!formData.title) {
      alert('请先填写标题');
      return;
    }
    setIsGenerating(true);
    const desc = await generateAIDescription(formData.title, formData.url);
    if (desc) {
      setFormData(prev => ({ ...prev, description: desc }));
    }
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url) return;

    onSave({
      ...(initialData ? { id: initialData.id } : {}),
      ...formData,
      tags: formData.tags.split(/[,，]/).map(t => t.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {initialData ? '编辑资源' : '添加新资源'}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">标题 *</label>
              <input 
                required
                type="text" 
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-zinc-600"
                placeholder="资源名称"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">链接 *</label>
              <input 
                required
                type="url" 
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-zinc-600"
                placeholder="https://..."
                value={formData.url}
                onChange={e => setFormData({...formData, url: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">分类</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setFormData({...formData, category: c.id})}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${formData.category === c.id ? 'bg-purple-600 text-white shadow-lg' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">图标选择</label>
              <div className="grid grid-cols-5 gap-2 bg-zinc-800/30 p-2 rounded-xl border border-zinc-700/50">
                {EMOJI_LIST.map(e => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setFormData({...formData, icon: e})}
                    className={`text-xl p-1 rounded-md hover:bg-zinc-700 transition-colors ${formData.icon === e ? 'bg-zinc-700 ring-1 ring-purple-500' : ''}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">描述</label>
              <button
                type="button"
                onClick={handleAISuggestDescription}
                disabled={isGenerating}
                className="text-[10px] flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
              >
                {isGenerating ? '正在生成...' : (
                  <>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" /></svg>
                    AI 自动补全描述
                  </>
                )}
              </button>
            </div>
            <textarea 
              rows={3}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-zinc-600 text-sm"
              placeholder="这个资源是做什么的？"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">标签 (用逗号分隔)</label>
            <input 
              type="text" 
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-zinc-600 text-sm"
              placeholder="AI, 工具, 效率"
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98]"
            >
              取消
            </button>
            <button 
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/20 transition-all active:scale-[0.98]"
            >
              {initialData ? '保存修改' : '立即添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResourceModal;
