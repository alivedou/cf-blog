/** 
 * Author: adou | alivedou@outlook.com
 * 应用主入口文件：负责全局状态管理、页面路由切换、深色模式控制以及数据的获取与展示。
 */
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { PostCard } from './components/PostCard';
import { SearchBar } from './components/Search';
import { PostMetadata, PostDetail } from './types';
import Markdown from 'react-markdown';
import { ChevronLeft, Share2, MessageCircle, Sun, Moon, Menu as MenuIcon, X, Eye, Image as ImageIcon, ArrowUp, ArrowDown, Pin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
// @ts-ignore - 预构建脚本生成的文件，可能在首次运行前不存在
import postsData from './posts-data.json';
import { ABOUT_PAGE_CONFIG, AUTHOR_NAME, SITE_TITLE, THEME_COLOR, SITE_BG_OPACITY, POST_BOTTOM_IMAGES, LEANCLOUD_CONFIG, HOME_PAGE_DESCRIPTION } from '@/blog.config';
import { trackPageView } from './lib/leancloud';

export default function App() {
  /** 1. 核心状态维护 */
  const [posts, setPosts] = useState<PostMetadata[]>([]);            // 整体文章列表
  const [selectedPost, setSelectedPost] = useState<PostDetail | null>(null); // 当前展示的文章内容
  const [activeTab, setActiveTab] = useState('home');                // 侧边栏活动项
  const [currentViews, setCurrentViews] = useState<number>(0);       // 当前文章阅读量
  
  // 深色模式初始化：从本地存储获取或匹配系统偏好
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  // 默认背景图 (小白不容易找到并修改这里)
  const DEFAULT_BG = "https://i.urusai.cc/Pws4B.jpg";

  const [bgImage, setBgImage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bg-image') || "";
    }
    return "";
  });
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // 提示信息处理
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  /** 辅助功能：滚动控制 */
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      showNotification("链接已复制到剪贴板！");
    }).catch(() => {
      showNotification("分享失败，请直接复制地址栏链接");
    });
  };

  const handleMessage = () => {
    showNotification("评论功能正在开发中...");
  };

  // 屏幕尺寸监听：实现移动端侧边栏的自动收纳，并防止虚拟键盘弹出触发收缩
  useEffect(() => {
    let lastWidth = window.innerWidth;
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      // 只有在屏幕宽度发生本质变化，或跨越 1024px 临界点时才处理
      if (currentWidth !== lastWidth) {
        if (currentWidth >= 1024 && lastWidth < 1024) {
          setIsSidebarOpen(true);
        } else if (currentWidth < 1024 && lastWidth >= 1024) {
          setIsSidebarOpen(false);
        }
        lastWidth = currentWidth;
      }
    };
    // 取消了对 handleResize() 的无脑初始调用，因为 state 初始值已经处理过桌面端/移动端逻辑
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchPosts();
    // 初始路由解析：允许直接通过 /post/slug 访问文章
    const path = window.location.pathname;
    if (path.startsWith('/post/')) {
      const slug = path.replace('/post/', '').split('?')[0].split('#')[0];
      if (slug) {
        handlePostClick(slug, true);
      }
    }
  }, []);

  // 监听浏览器后退/前进
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/post/')) {
        const slug = path.replace('/post/', '').split('?')[0].split('#')[0];
        if (slug) {
          handlePostClick(slug, true);
        }
      } else {
        setSelectedPost(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 监听深色模式变化并应用到 html 根元素
  useEffect(() => {
    document.title = SITE_TITLE;
    // 设置主题色变量
    document.documentElement.style.setProperty('--theme-primary', THEME_COLOR);
    
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

  /** 2. 数据获取逻辑 */
  const fetchPosts = async () => {
    try {
      const resp = await fetch('/api/posts');
      if (!resp.ok) throw new Error('API not available');
      const data = await resp.json();
      setPosts(data);
      setLoading(false);
    } catch (err) {
      // 容错机制：当 API 不可用时，自动读取本地生成的 posts-data.json
      console.log('正在使用本地预构建数据...');
      setPosts(postsData.map((p: any) => p.metadata) as PostMetadata[]);
      setLoading(false);
    }
  };

  /** 3. 文章点击处理：获取全文内容并开启阅读量追踪 */
  const handlePostClick = async (slug: string, skipPushState = false) => {
    if (!skipPushState) {
      window.history.pushState({}, '', `/post/${slug}`);
    }
    setLoading(true);
    setCurrentViews(0); // 切换文章时重置阅读量显示
    try {
      const resp = await fetch(`/api/posts/${slug}`);
      if (!resp.ok) throw new Error('API not available');
      const data = await resp.json();
      setSelectedPost(data);
      window.scrollTo(0, 0); // 瞬间回顶，优化阅读体验
      
      // 触发 LeanCloud 浏览量统计 (仅在 config 中开启后生效)
      if (LEANCLOUD_CONFIG.enabled) {
        const views = await trackPageView(slug);
        setCurrentViews(views);
      }
    } catch (err) {
      // 容错：如果 API 加载失败，从本地 postsData 缓存中查找内容
      const staticPost = (postsData as unknown as PostDetail[]).find(p => p.slug === slug);
      if (staticPost) {
        setSelectedPost(staticPost);
        window.scrollTo(0, 0);
        
        // 静态模式下的阅读量追踪
        if (LEANCLOUD_CONFIG.enabled) {
          const views = await trackPageView(slug);
          setCurrentViews(views);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // 切换深色/浅色模式
  const toggleDark = () => {
    setIsDark(!isDark);
  };

  return (
    <div className="min-h-dvh font-sans selection:bg-primary/20 dark:selection:bg-primary/30">
      {/* 移动端侧边栏遮罩层 */}
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

      {/* 侧边栏开关按钮 - 优化：改为固定定位（Fixed），降低常态不透明度 */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-6 left-6 z-50 p-2 md:p-3 rounded-xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-gray-200/50 dark:border-zinc-800/50 shadow-sm hover:bg-white/80 dark:hover:bg-zinc-900/80 hover:shadow-md transition-all text-gray-400 dark:text-zinc-500 flex items-center group"
          title="打开菜单"
        >
          <MenuIcon size={18} className="group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* 昼夜模式切换按钮 - 固定在右上角，相对于屏幕不动 */}
      <button
        onClick={toggleDark}
        className="fixed top-6 right-6 z-50 p-2 md:p-3 rounded-xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-gray-200/50 dark:border-zinc-800/50 shadow-sm hover:bg-white/80 dark:hover:bg-zinc-900/80 hover:shadow-md transition-all text-yellow-500 dark:text-yellow-400 flex items-center group"
        title={isDark ? "切换到白天模式" : "切换到黑夜模式"}
      >
        {isDark ? (
          <Sun size={20} className="group-hover:rotate-45 transition-transform" />
        ) : (
          <Moon size={20} className="group-hover:-rotate-12 transition-transform" />
        )}
      </button>

      {/* 回到顶部/底部 快速导航按钮 */}
      <div className="fixed bottom-8 right-6 z-50 flex flex-col space-y-3">
        <button
          onClick={scrollToTop}
          className="p-3 rounded-full bg-white/40 dark:bg-zinc-800/40 backdrop-blur-md border border-gray-200 dark:border-zinc-700 shadow-sm text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-white/80 dark:hover:bg-zinc-800/80 transition-all group"
          title="回到顶部"
        >
          <ArrowUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
        </button>
        <button
          onClick={scrollToBottom}
          className="p-3 rounded-full bg-white/40 dark:bg-zinc-800/40 backdrop-blur-md border border-gray-200 dark:border-zinc-700 shadow-sm text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-white/80 dark:hover:bg-zinc-800/80 transition-all group"
          title="前往底部"
        >
          <ArrowDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>


      <div 
        className="transition-colors duration-500 min-h-dvh relative"
        style={{
          backgroundImage: (bgImage || DEFAULT_BG) ? `linear-gradient(rgba(${isDark ? '18, 18, 18' : '255, 255, 255'}, ${SITE_BG_OPACITY}), rgba(${isDark ? '18, 18, 18' : '255, 255, 255'}, ${SITE_BG_OPACITY})), url("${bgImage || DEFAULT_BG}")` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundColor: isDark ? '#121212' : '#f4f4f5'
        }}
      >
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (selectedPost) {
              window.history.pushState({}, '', '/');
            }
            setSelectedPost(null);
            setSelectedTag(null);
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
          }}
          bgImage={bgImage}
          setBgImage={setBgImage}
          onShare={handleShare}
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
                {selectedPost.metadata.image && (
                  <img 
                    src={selectedPost.metadata.image} 
                    alt={selectedPost.metadata.title}
                    className="w-full h-80 object-cover rounded-3xl shadow-2xl mb-8"
                    referrerPolicy="no-referrer"
                  />
                )}
                
                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-zinc-800 relative">
                  <button 
                    onClick={() => {
                      setSelectedPost(null);
                      window.history.pushState({}, '', '/');
                    }}
                    className="flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors mb-10 group"
                  >
                    <ChevronLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                    返回文章列表
                  </button>

                  <header className="mb-12">
                    <div className="flex items-center space-x-3 mb-6">
                      {(selectedPost.metadata.tags || []).map(tag => (
                        <button 
                          key={tag} 
                          onClick={() => {
                            setSelectedPost(null);
                            setActiveTab('tags');
                            setSelectedTag(tag);
                            window.history.pushState({}, '', '/');
                          }}
                          className="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary/20 transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 leading-tight">
                      {selectedPost.metadata.title}
                    </h1>
                    <div className="mt-8 flex items-center justify-between pb-8 border-b border-gray-100 dark:border-zinc-800">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-linear-to-r from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                          {AUTHOR_NAME}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-zinc-100">{AUTHOR_NAME}</p>
                          <div className="flex items-center space-x-3 mt-0.5">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                              {(() => {
                                const d = new Date(selectedPost.metadata.date);
                                return isNaN(d.getTime()) ? selectedPost.metadata.date : `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, '0')}月${String(d.getDate()).padStart(2, '0')}日`;
                              })()}
                            </p>
                            {LEANCLOUD_CONFIG.enabled && currentViews > 0 && (
                              <span className="flex items-center text-[10px] text-gray-400 font-medium">
                                <Eye size={12} className="mr-1" />
                                {currentViews} 次阅读
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-gray-400">
                        <button onClick={handleShare} className="hover:text-primary transition-colors"><Share2 size={20} /></button>
                        <button onClick={handleMessage} className="hover:text-primary transition-colors"><MessageCircle size={20} /></button>
                      </div>
                    </div>
                  </header>

                  <div className="prose prose-lg dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 leading-relaxed mb-16">
                    <div className="markdown-body">
                      <Markdown
                        components={{
                          img: ({node, ...props}) => <img {...props} referrerPolicy="no-referrer" />
                        }}
                      >
                        {selectedPost.content}
                      </Markdown>
                    </div>
                  </div>

                  {/* 文章底部自定义图片列表 (二维码等) - 已支持循环渲染 */}
                  {POST_BOTTOM_IMAGES && POST_BOTTOM_IMAGES.length > 0 && (
                    <div className="mt-16 pt-12 border-t border-gray-100 dark:border-zinc-800 flex flex-wrap justify-center gap-12">
                      {POST_BOTTOM_IMAGES.filter(img => img.enabled).map((img, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className="relative group">
                            <div className="absolute -inset-4 bg-primary/10 rounded-[2rem] blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
                            <div className="relative p-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-700">
                              <img 
                                src={img.url} 
                                alt={img.label} 
                                className="w-32 h-32 md:w-36 md:h-36 object-cover rounded-xl"
                              />
                            </div>
                          </div>
                          <p className="mt-6 text-[11px] font-bold text-gray-500 dark:text-zinc-400 flex items-center uppercase tracking-widest">
                            <ImageIcon size={12} className="mr-2 text-primary" />
                            {img.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="post-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {activeTab === 'about' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-3xl mx-auto"
                  >
                    <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden shadow-2xl mb-10">
                      <img 
                        src={ABOUT_PAGE_CONFIG.image} 
                        alt="About Me Banner" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-10">
                        <div>
                          <h2 className="text-4xl font-black text-white">{ABOUT_PAGE_CONFIG.name}</h2>
                          <p className="text-white/80 font-medium">{ABOUT_PAGE_CONFIG.title}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-zinc-800">
                      <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                        {ABOUT_PAGE_CONFIG.description}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-zinc-800 flex flex-col mb-12">
                      <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">
                        {activeTab === 'home' ? '探索故事' 
                         : activeTab === 'tags' ? (selectedTag ? `# ${selectedTag}` : '浏览标签')
                         : activeTab === 'archive' ? '归档'
                         : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                      </h1>
                      <p className="text-xl text-gray-600 dark:text-zinc-300 font-medium">
                        {activeTab === 'home' 
                          ? HOME_PAGE_DESCRIPTION 
                          : activeTab === 'tags' ? (selectedTag ? `标签为 "${selectedTag}" 的文章` : '浏览所有话题。')
                          : activeTab === 'archive' ? '回顾过往的文章动态。'
                          : `正在探索 ${activeTab}。`}
                      </p>
                      {activeTab === 'tags' && selectedTag && (
                        <button 
                          onClick={() => setSelectedTag(null)}
                          className="mt-4 text-sm font-bold text-primary hover:opacity-80 flex items-center"
                        >
                          <X size={14} className="mr-1" /> 清除筛选
                        </button>
                      )}
                    </div>

                    <SearchBar posts={postsData as unknown as PostDetail[]} onResultClick={handlePostClick} />

                    {loading ? (
                      <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <>
                        {activeTab === 'archive' ? (
                          <div className="space-y-12 max-w-3xl mx-auto p-8 md:p-12 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-[3rem] shadow-sm border border-white/50 dark:border-zinc-800/50">
                            {Object.entries(
                              posts.reduce((acc, post) => {
                                const d = post.date ? new Date(post.date) : new Date();
                                const date = isNaN(d.getTime()) ? new Date() : d;
                                const year = date.getFullYear();
                                const month = date.getMonth() + 1; // 1-12
                                if (!acc[year]) acc[year] = {};
                                if (!acc[year][month]) acc[year][month] = [];
                                acc[year][month].push(post);
                                return acc;
                              }, {} as Record<number, Record<number, PostMetadata[]>>)
                            )
                            .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
                            .map(([year, months]) => (
                               <div key={year} className="relative pl-8 border-l-2 border-gray-200 dark:border-zinc-800 space-y-10">
                                <div className="absolute -left-[5px] top-0 w-2 h-2 bg-primary rounded-full border border-white dark:border-zinc-950" />
                                <h3 className="text-4xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">{year}</h3>
                                
                                <div className="space-y-12">
                                  {Object.entries(months as Record<number, PostMetadata[]>)
                                    .sort(([monthA], [monthB]) => Number(monthB) - Number(monthA))
                                    .map(([month, monthPosts]) => (
                                      <div key={month} className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                          <span className="text-sm font-black text-primary px-2 py-0.5 bg-primary/5 rounded-md uppercase tracking-widest">
                                            {Number(month)}月
                                          </span>
                                          <div className="h-px flex-1 bg-linear-to-r from-gray-200/50 to-transparent dark:from-zinc-800/50" />
                                        </div>
                                        <div className="space-y-4 pl-4">
                                          {monthPosts.map((post) => (
                                            <div 
                                              key={post.slug} 
                                              onClick={() => handlePostClick(post.slug)}
                                              className="group cursor-pointer flex items-center space-x-4"
                                            >
                                              <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-tighter tabular-nums">
                                                {(() => {
                                                  const d = new Date(post.date);
                                                  return isNaN(d.getTime()) ? '--' : d.getDate().toString().padStart(2, '0');
                                                })()}
                                              </span>
                                              <h4 className="text-lg font-bold text-gray-700 dark:text-zinc-300 group-hover:text-primary transition-colors line-clamp-1">
                                                {post.title}
                                              </h4>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : activeTab === 'tags' && !selectedTag ? (
                          <div className="flex flex-wrap gap-4 py-10">
                            {Array.from(new Set(posts.flatMap(p => (p.tags || []).filter(tag => tag && typeof tag === 'string')).map(t => t.toLowerCase()))).map(lowerTag => {
                              const originalTag = posts.flatMap(p => (p.tags || []).filter(tag => tag && typeof tag === 'string')).find(t => t.toLowerCase() === lowerTag);
                              const count = posts.filter(p => (p.tags || []).some(t => t && typeof t === 'string' && t.toLowerCase() === lowerTag)).length;
                              return (
                                <button
                                  key={lowerTag}
                                  onClick={() => setSelectedTag(originalTag || lowerTag)}
                                  className="px-6 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md hover:border-primary transition-all flex items-center"
                                >
                                  <span className="font-bold text-gray-900 dark:text-zinc-100 mr-2">{originalTag || lowerTag}</span>
                                  <span className="text-xs text-gray-400 bg-gray-50 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{count}</span>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="space-y-12">
                            {/* 置顶文章区域 */}
                            {activeTab === 'home' && posts.some(p => p.sticky !== null && p.sticky !== undefined) && (
                              <div className="mb-12">
                                <div className="inline-flex items-center px-4 py-2 rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-white/20 dark:border-zinc-800/20 shadow-sm mb-6">
                                  <h2 className="text-xl md:text-2xl font-black flex items-center text-gray-900 dark:text-zinc-100">
                                    <Pin className="mr-2 text-primary rotate-45" size={24} /> 推荐阅读
                                  </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                                  {posts.filter(p => p.sticky !== null && p.sticky !== undefined).slice(0, 4).map(post => (
                                    <PostCard key={post.slug} post={post} onClick={handlePostClick} isSticky={true} />
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 常规文章列表区域 */}
                            <div>
                              {activeTab === 'home' && posts.some(p => p.sticky !== null && p.sticky !== undefined) && (
                                <div className="inline-flex items-center px-4 py-2 rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-white/20 dark:border-zinc-800/20 shadow-sm mb-6 mt-4">
                                  <h2 className="text-xl md:text-2xl font-black flex items-center text-gray-900 dark:text-zinc-100">
                                    全部文章
                                  </h2>
                                </div>
                              )}
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                                {posts.filter(post => {
                                  if (activeTab === 'home' && post.sticky !== null && post.sticky !== undefined) return false; // 主页的置顶文章已经在上面渲染过了
                                  if (activeTab === 'home') return true;
                                  if (activeTab === 'tags' && selectedTag) {
                                    return (post.tags || []).some(t => t && typeof t === 'string' && t.toLowerCase() === selectedTag.toLowerCase());
                                  }
                                  return true;
                                }).length > 0 ? posts.filter(post => {
                                  if (activeTab === 'home' && post.sticky !== null && post.sticky !== undefined) return false;
                                  if (activeTab === 'home') return true;
                                  if (activeTab === 'tags' && selectedTag) {
                                    return (post.tags || []).some(t => t && typeof t === 'string' && t.toLowerCase() === selectedTag.toLowerCase());
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
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* 网站底页版权信息 */}
        <footer className={cn(
          "transition-all duration-300 py-8 text-center flex flex-col items-center",
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        )}>
          <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-full px-5 py-2 inline-flex flex-col md:flex-row items-center gap-1 md:gap-3 shadow-sm border border-gray-200/50 dark:border-zinc-800/50">
            <span className="text-xs font-medium text-gray-700 dark:text-zinc-300">
              Copyright &copy; 2026 cf-blog | Powered by adou
            </span>
            <span className="hidden md:inline text-gray-300 dark:text-zinc-700">|</span>
            <span className="text-[10px] font-medium text-gray-500 dark:text-zinc-400">
              Open Source under MIT License
            </span>
          </div>
        </footer>
      </div>

      {/* 提示通知 UI */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[100] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center space-x-2 border border-white/10 dark:border-black/5"
          >
            <span className="text-sm">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
