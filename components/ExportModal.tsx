
import React, { useState } from 'react';
import { Resource } from '../types';

interface ExportModalProps {
  onClose: () => void;
  resources: Resource[];
}

const ExportModal: React.FC<ExportModalProps> = ({ onClose, resources }) => {
  const [copied, setCopied] = useState(false);

  // 清理 ID，将 custom- 前缀去除或保留为唯一 ID，以便存入代码
  const cleanResources = resources.map(res => ({
    ...res,
    // 保持 ID 干净
    id: res.id.startsWith('custom-') ? res.id.replace('custom-', '') : res.id,
    featured: res.featured || false
  }));

  const codeString = `export const RESOURCES: Resource[] = ${JSON.stringify(cleanResources, null, 2)};`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-800 w-full max-w-3xl rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">同步到 GitHub</h2>
            <p className="text-zinc-500 text-sm mt-1">复制下方代码，替换项目中的 <code className="text-purple-400">constants.tsx</code> 内容即可永久保存。</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative group">
          <pre className="bg-black/50 border border-zinc-800 rounded-2xl p-6 text-xs text-zinc-400 overflow-auto max-h-[50vh] font-mono leading-relaxed">
            {codeString}
          </pre>
          <button 
            onClick={handleCopy}
            className={`absolute top-4 right-4 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xl ${copied ? 'bg-green-600 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
          >
            {copied ? '已复制！' : '复制代码内容'}
          </button>
        </div>

        <div className="mt-8 p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
          <div className="flex gap-3">
            <div className="text-xl">💡</div>
            <div className="text-xs text-purple-200/80 leading-5">
              <p className="font-bold text-purple-300 mb-1">为什么需要这一步？</p>
              这是一个静态网页。为了让您在不同设备都能看到新增的资源，您需要将这些数据“写入”到 GitHub 的源代码中。复制后提交代码，您的导航站就会永久更新。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
