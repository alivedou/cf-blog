/** 
 * Author: adou | alivedou@outlook.com
 * 侧边栏组件：包含个人头像、主导航菜单、社交链接以及背景图设置。
 */
import React from 'react';
import { ExternalLink, Image as ImageIcon, X, Share2, Mail } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AUTHOR_NAME, AUTHOR_TITLE, AUTHOR_AVATAR, MENU_ITEMS, RECOMMENDED_LINKS, AUTHOR_CONTACT } from '../user-config';

/** 侧边栏需要的属性定义 */
interface SidebarProps {
  isOpen: boolean;      // 侧边栏是否开启状态
  onClose: () => void;  // 关闭侧边栏的回调函数（主要用于移动端）
  activeTab: string;    // 当前处于哪个页面（首页/归档/关于等）
  setActiveTab: (tab: string) => void; 
  bgImage: string;      // 用户自定义的背景图片链接
  setBgImage: (url: string) => void;
  onShare: () => void;  // 分享网站的回调函数
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeTab, setActiveTab, bgImage, setBgImage, onShare }) => {
  return (
    <aside className={cn(
      // 样式说明：fixed 定位，毛玻璃效果 (backdrop-blur)，平滑过度 (transition-transform)
      "fixed top-0 left-0 h-screen w-64 border-r border-gray-300 dark:border-zinc-800 bg-[#d8d8d8]/95 dark:bg-[#181818]/98 backdrop-blur-xl flex flex-col transition-transform duration-300 z-50",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* 移动端快速关闭按钮：只在小屏幕显示 */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors lg:hidden z-10"
      >
        <X size={20} />
      </button>

      {/* 侧边栏主内容区：设置 flex-1 并开启滚动，防止内容过多显示不全 */}
      <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
        {/* 博主个人名片展示 */}
        <div className="flex flex-col items-center mb-10 text-center">
          <img 
            src={AUTHOR_AVATAR}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover mb-4 shadow-lg ring-4 ring-white dark:ring-zinc-800"
          />
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{AUTHOR_NAME}</h1>
          <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1 font-medium mb-4">{AUTHOR_TITLE}</p>

          {AUTHOR_CONTACT && (
            <a 
              href={AUTHOR_CONTACT}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-colors"
            >
              <Mail size={14} className="mr-1.5" />
              联系我
            </a>
          )}
        </div>


        {/* 主导航菜单：遍历渲染配置中的菜单项 */}
        <nav className="space-y-1 mb-8">
          <p className="px-4 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500">菜单导航</p>
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200",
                activeTab === item.id 
                  ? "bg-primary text-white shadow-md"
                  : "text-zinc-700 dark:text-zinc-400 hover:bg-gray-200/50 dark:hover:bg-zinc-800/50"
              )}
            >
              <item.icon className={cn("w-5 h-5 mr-3", activeTab === item.id ? "text-white" : "text-gray-400 dark:text-zinc-500 group-hover:text-primary")} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* 社交/推荐链接：点击会在新窗口打开 */}
        <div className="space-y-1">
          <p className="px-4 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500">发现更多</p>
          {RECOMMENDED_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-400 rounded-xl hover:bg-white dark:hover:bg-zinc-800 hover:shadow-sm group transition-all duration-200"
            >
              <div className="flex items-center">
                <link.icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-primary transition-colors" />
                {link.label}
              </div>
              <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300" />
            </a>
          ))}
        </div>
      </div>

      {/* 底部操作区：固定功能按钮 */}
      <div className="p-8 pt-6 border-t border-gray-100 dark:border-zinc-900 bg-inherit backdrop-blur-xl">
        {/* 自定义背景图输入框 */}
        <div className="px-4 pb-4">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500 flex items-center">
            <ImageIcon size={10} className="mr-1" /> 自定义背景
          </p>
          <div className="relative group">
            <input 
              type="text" 
              placeholder="外链图片 URL..."
              value={bgImage}
              onChange={(e) => setBgImage(e.target.value)}
              className="w-full text-[10px] bg-white/40 dark:bg-zinc-900/50 border border-gray-300 dark:border-zinc-800 rounded-lg p-2 pr-8 focus:ring-1 focus:ring-primary outline-hidden transition-all text-zinc-700 dark:text-zinc-400"
            />
            {bgImage && (
              <button 
                onClick={() => setBgImage('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                title="清除背景图"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* 分享网站按钮 */}
        <div className="px-4 mt-2">
          <button
            onClick={onShare}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-white/40 dark:bg-zinc-900/50 border border-gray-300 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group"
          >
            <Share2 size={14} className="group-hover:scale-110 transition-transform" />
            <span>分享本站</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
