
import React, { useState, useMemo, useEffect } from 'react';
import { CATEGORIES, RESOURCES as DEFAULT_RESOURCES } from './constants';
import { Category, Resource } from './types';
import ResourceCard from './components/ResourceCard';
import AddResourceModal from './components/AddResourceModal';
import ExportModal from './components/ExportModal';

const STORAGE_KEY = 'user_added_resources';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  
  const [allResources, setAllResources] = useState<Resource[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const localRes = saved ? JSON.parse(saved) : [];
    // 过滤掉已经在 DEFAULT_RESOURCES 中存在的 ID，避免重复显示
    const defaultIds = new Set(DEFAULT_RESOURCES.map(r => r.id));
    const filteredLocal = localRes.filter((r: Resource) => !defaultIds.has(r.id));
    setAllResources([...DEFAULT_RESOURCES, ...filteredLocal]);
  }, []);

  const handleSaveResource = (resData: Omit<Resource, 'id'> & { id?: string }) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let localRes: Resource[] = saved ? JSON.parse(saved) : [];
    
    if (resData.id) {
      // 如果是自定义资源（带 custom- 前缀）
      if (resData.id.startsWith('custom-')) {
        localRes = localRes.map(r => r.id === resData.id ? { ...resData as Resource } : r);
      } else {
        // 如果是在“编辑”默认资源，将其转化为自定义资源保存到本地
        const newRes: Resource = { ...resData as Resource, id: `custom-${resData.id}` };
        localRes = [newRes, ...localRes];
      }
    } else {
      // 添加全新资源
      const newRes: Resource = {
        ...resData as Omit<Resource, 'id'>,
        id: `custom-${Date.now()}`,
      };
      localRes = [newRes, ...localRes];
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localRes));
    
    // 重新计算 allResources
    const defaultIds = new Set(DEFAULT_RESOURCES.map(r => r.id));
    setAllResources([...DEFAULT_RESOURCES, ...localRes.filter(r => !defaultIds.has(r.id))]);
    
    setIsModalOpen(false);
    setEditingResource(null);
  };

  const handleDeleteResource = (id: string) => {
    if (!id.startsWith('custom-')) {
      alert('默认示例资源不可直接物理删除。您可以编辑它，或在代码中删除。');
      return;
    }
    
    const saved = localStorage.getItem(STORAGE_KEY);
    const localRes = saved ? JSON.parse(saved) : [];
    const updatedLocal = localRes.filter((r: Resource) => r.id !== id);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocal));
    setAllResources(allResources.filter(r => r.id !== id));
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  };

  const filteredResources = useMemo(() => {
    return allResources.filter(res => {
      const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
      const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           res.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, allResources]);

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <header className="py-16 md:py-24 flex flex-col items-center text-center relative">
        <div className="absolute top-8 right-0 flex gap-3">
           <button 
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-5 py-2.5 rounded-full text-sm font-medium transition-all border border-zinc-700 active:scale-95"
            title="将本地修改保存到 GitHub 代码中"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            同步到 GitHub
          </button>
           <button 
            onClick={() => { setEditingResource(null); setIsModalOpen(true); }}
            className="group flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-purple-900/20 active:scale-95"
          >
            <svg className="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            添加新资源
          </button>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
          Allen's AI 资源导航
        </h1>
        <p className="text-zinc-500 text-lg md:text-xl max-w-2xl font-light">
          您的私人 AI 智库。添加、编辑并永久保存您的灵感。
        </p>
      </header>

      <div className="sticky top-4 z-40 mb-12 backdrop-blur-md bg-zinc-950/70 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xl">
        <div className="flex flex-wrap justify-center gap-2">
          <button 
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === 'All' ? 'bg-white text-zinc-950 shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
          >
            全部
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${selectedCategory === cat.id ? 'bg-white text-zinc-950 shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <input 
            type="text"
            placeholder="搜索资源..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent text-zinc-200 transition-all"
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {filteredResources.length > 0 ? (
        <div className="bento-grid">
          {filteredResources.map(resource => (
            <ResourceCard 
              key={resource.id} 
              resource={resource} 
              onDelete={resource.id.startsWith('custom-') ? () => handleDeleteResource(resource.id) : undefined}
              onEdit={() => handleEditResource(resource)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
          <div className="text-6xl mb-4 grayscale opacity-20">🔍</div>
          <p className="text-zinc-500 italic text-lg">暂无匹配资源</p>
        </div>
      )}

      {isModalOpen && (
        <AddResourceModal 
          onClose={() => { setIsModalOpen(false); setEditingResource(null); }} 
          onSave={handleSaveResource} 
          initialData={editingResource}
        />
      )}

      {isExportOpen && (
        <ExportModal 
          onClose={() => setIsExportOpen(false)}
          resources={allResources}
        />
      )}
    </div>
  );
};

export default App;
