import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { PostCard } from './components/PostCard';
import { SearchBar } from './components/Search';
import { PostMetadata, PostDetail } from './types';
import Markdown from 'react-markdown';
import { ChevronLeft, Share2, MessageCircle, Sun, Moon, Menu as MenuIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function App() {
  const [posts, setPosts] = useState<PostMetadata[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostDetail | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [bgImage, setBgImage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bg-image') || '';
    }
    return '';
  });
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 移动端/响应式侧边栏处理：屏幕较小时默认关闭，较大时默认开启
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize(); // 初始检查
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ... rest of state
  const [summary, setSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  // 监听深色模式变化并应用到 html 根元素
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // 监听背景图片变化并保存到本地存储
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bg-image', bgImage);
    }
  }, [bgImage]);

  // 获取所有文章列表
  const fetchPosts = async () => {
    try {
      const resp = await fetch('/api/posts');
      const data = await resp.json();
      setPosts(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setLoading(false);
    }
  };

  // 处理文章点击事件：获取详情并切换视图
  const handlePostClick = async (slug: string) => {
    setLoading(true);
    setSummary(null);
    try {
      const resp = await fetch(`/api/posts/${slug}`);
      const data = await resp.json();
      setSelectedPost(data);
      window.scrollTo(0, 0); // 滚动到顶部
    } catch (err) {
      console.error('Error fetching post detail:', err);
    } finally {
      setLoading(false);
    }
  };

  // 调用 AI 总结接口获取文章摘要
  const handleSummarize = async () => {
    if (!selectedPost) return;
    setSummarizing(true);
    try {
      const resp = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: selectedPost.content }),
      });
      const data = await resp.json();
      setSummary(data.summary);
    } catch (err) {
      console.error('Summarization failed:', err);
    } finally {
      setSummarizing(false);
    }
  };

  // 切换深色/浅色模式
  const toggleDark = () => {
    setIsDark(!isDark);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-xs z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* 浮动侧边栏开关按钮 */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={cn(
          "fixed top-6 left-8 z-50 p-3 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-all text-gray-600 dark:text-zinc-400 lg:flex items-center space-x-2",
          isSidebarOpen ? "lg:opacity-0 pointer-events-none" : "lg:opacity-100"
        )}
      >
        <MenuIcon size={20} />
      </button>

      {/* 浮动主题切换按钮 */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-6 right-8 z-50 p-3 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-200 dark:border-zinc-800 shadow-lg hover:shadow-xl hover:scale-110 transition-all text-gray-600 dark:text-zinc-400 group"
        title={isDark ? "切换到浅色模式" : "切换到深色模式"}
      >
        {isDark ? (
          <Sun size={20} className="group-hover:text-yellow-500 transition-colors" />
        ) : (
          <Moon size={20} className="group-hover:text-indigo-500 transition-colors" />
        )}
      </button>

      <div 
        className="transition-colors duration-500 min-h-screen relative"
        style={{
          backgroundImage: bgImage ? `linear-gradient(rgba(255, 255, 255, ${isDark ? '0.9' : '0.8'}), rgba(255, 255, 255, ${isDark ? '0.9' : '0.8'})), url(${bgImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundColor: !bgImage ? (isDark ? '#121212' : '#e5e5e5') : 'transparent'
        }}
      >
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedPost(null);
            setSelectedTag(null);
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
          }}
          isDark={isDark}
          toggleDark={toggleDark}
          bgImage={bgImage}
          setBgImage={setBgImage}
        />

        <main className={cn(
          "transition-all duration-300 p-6 md:p-12 max-w-7xl mx-auto",
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        )}>
          <AnimatePresence mode="wait">
            {selectedPost ? (
              <motion.div
                key="post-detail"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="flex items-center text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors mb-10 group"
                >
                  <ChevronLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                  返回博客列表
                </button>

                {selectedPost.metadata.image && (
                  <img 
                    src={selectedPost.metadata.image} 
                    alt={selectedPost.metadata.title}
                    className="w-full h-80 object-cover rounded-3xl shadow-2xl mb-12"
                    referrerPolicy="no-referrer"
                  />
                )}

                <header className="mb-12">
                  <div className="flex items-center space-x-3 mb-6">
                    {(selectedPost.metadata.tags || []).map(tag => (
                      <button 
                        key={tag} 
                        onClick={() => {
                          setSelectedPost(null);
                          setActiveTab('tags');
                          setSelectedTag(tag);
                        }}
                        className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <h1 className="text-5xl font-black text-gray-900 dark:text-gray-100 leading-tight">
                    {selectedPost.metadata.title}
                  </h1>
                  <div className="mt-8 flex items-center justify-between pb-8 border-b border-gray-100 dark:border-zinc-900">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-linear-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                        JD
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-zinc-100">Jane Doe</p>
                        <p className="text-xs text-gray-500">{selectedPost.metadata.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-gray-400">
                      <button 
                        onClick={handleSummarize}
                        disabled={summarizing}
                        className="flex items-center space-x-2 text-xs font-bold bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 px-3 py-2 rounded-xl hover:bg-indigo-100 transition-all border border-indigo-100 dark:border-indigo-900/50"
                      >
                        {summarizing ? '正在生成总结...' : 'AI 总结'}
                      </button>
                      <button className="hover:text-indigo-600 transition-colors"><Share2 size={20} /></button>
                      <button className="hover:text-indigo-600 transition-colors"><MessageCircle size={20} /></button>
                    </div>
                  </div>
                </header>

                <AnimatePresence>
                  {summary && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-10 p-6 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl"
                    >
                      <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-3">AI 文章总结</h3>
                      <div className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed space-y-2">
                        <Markdown>{summary}</Markdown>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="prose prose-lg dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 leading-relaxed">
                  <div className="markdown-body">
                    <Markdown>{selectedPost.content}</Markdown>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="post-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col mb-16">
                  <h1 className="text-6xl font-black text-gray-900 dark:text-gray-100 mb-4 tracking-tighter">
                    {activeTab === 'home' ? '探索故事' 
                     : activeTab === 'tags' ? (selectedTag ? `# ${selectedTag}` : '浏览标签')
                     : activeTab === 'archives' ? '归档'
                     : activeTab === 'about' ? '关于我'
                     : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </h1>
                  <p className="text-xl text-gray-500 dark:text-zinc-500 font-medium">
                    {activeTab === 'home' 
                      ? '分享关于设计、技术与创意过程的思考。' 
                      : activeTab === 'tags' ? (selectedTag ? `标签为 "${selectedTag}" 的文章` : '浏览所有话题。')
                      : activeTab === 'archives' ? '回顾过往的文章动态。'
                      : activeTab === 'about' ? '你好，很高兴见到你！'
                      : `正在探索 ${activeTab}。`}
                  </p>
                  {activeTab === 'tags' && selectedTag && (
                    <button 
                      onClick={() => setSelectedTag(null)}
                      className="mt-4 text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center"
                    >
                      <X size={14} className="mr-1" /> 清除筛选
                    </button>
                  )}
                </div>

                <SearchBar posts={posts} onResultClick={handlePostClick} />

                {loading ? (
                  <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    {activeTab === 'tags' && !selectedTag ? (
                      <div className="flex flex-wrap gap-4 py-10">
                        {Array.from(new Set(posts.flatMap(p => p.tags || []).map(t => t.toLowerCase()))).map(lowerTag => {
                          const originalTag = posts.flatMap(p => p.tags || []).find(t => t.toLowerCase() === lowerTag);
                          const count = posts.filter(p => p.tags?.some(t => t.toLowerCase() === lowerTag)).length;
                          return (
                            <button
                              key={lowerTag}
                              onClick={() => setSelectedTag(originalTag || lowerTag)}
                              className="px-6 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-500 transition-all flex items-center"
                            >
                              <span className="font-bold text-gray-900 dark:text-zinc-100 mr-2">{originalTag || lowerTag}</span>
                              <span className="text-xs text-gray-400 bg-gray-50 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{count}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {posts.filter(post => {
                          if (activeTab === 'home') return true;
                          if (activeTab === 'tags' && selectedTag) {
                            return post.tags?.some(t => t.toLowerCase() === selectedTag.toLowerCase());
                          }
                          // Add more tab logic if needed
                          return true;
                        }).length > 0 ? posts.filter(post => {
                          if (activeTab === 'home') return true;
                          if (activeTab === 'tags' && selectedTag) {
                            return post.tags?.some(t => t.toLowerCase() === selectedTag.toLowerCase());
                          }
                          return true;
                        }).map(post => (
                          <PostCard key={post.slug} post={post} onClick={handlePostClick} />
                        )) : (
                          <div className="col-span-full py-20 text-center">
                            <p className="text-gray-500 text-lg">该分类下暂无文章。</p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
