import React, { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { PostMetadata } from '@/src/types';

interface SearchBarProps {
  posts: PostMetadata[];
  onResultClick: (slug: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ posts, onResultClick }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PostMetadata[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 本地搜索处理：根据标题、描述、标签进行过滤
  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim().length > 1) {
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(q.toLowerCase()) || 
        post.description.toLowerCase().includes(q.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(q.toLowerCase()))
      );
      setResults(filtered);
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  };

  // AI 智能搜索处理：调用后端 AI 接口分析语义并匹配文章
  const handleAISearch = async () => {
    if (!query.trim()) return;
    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      const filtered = posts.filter(post => data.slugs.includes(post.slug));
      setResults(filtered);
      setIsSearching(true);
    } catch (error) {
      console.error('AI search failed', error);
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto mb-10">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="搜索文章 (尝试输入 'hugo' 或 '设计')..."
          className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl pl-12 pr-24 py-4 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all text-gray-900 dark:text-zinc-100"
        />
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <button 
          onClick={handleAISearch}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-linear-to-r from-indigo-500 to-purple-600 text-white px-4 py-1.5 rounded-xl text-xs font-bold hover:shadow-lg transition-all"
        >
          AI 搜索
        </button>
      </div>

      {isSearching && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-4 z-50">
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">找到 {results.length} 条结果</span>
            <button onClick={() => setIsSearching(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
              <X size={16} className="text-gray-400" />
            </button>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {results.length > 0 ? results.map(post => (
              <div 
                key={post.slug}
                onClick={() => {
                  onResultClick(post.slug);
                  setIsSearching(false);
                }}
                className="p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl cursor-pointer transition-colors"
              >
                <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-sm">{post.title}</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-500 line-clamp-1">{post.description}</p>
              </div>
            )) : (
              <p className="text-center text-gray-500 py-4 text-sm">未找到匹配文章。</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
