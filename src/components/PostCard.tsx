/** 
 * Author: adou | alivedou@outlook.com
 * 文章卡片组件：用于在列表页展示文章封面、标题、描述和日期。
 */
import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { PostMetadata } from '@/src/types';
import { format } from 'date-fns';

/** 卡片组件接收的参数 */
interface PostCardProps {
  post: PostMetadata;             // 文章的基础信息（元数据）
  onClick: (slug: string) => void; // 点击卡片后的跳转回调
  isSticky?: boolean;              // 是否为置顶文章
}

export const PostCard: React.FC<PostCardProps> = ({ post, onClick, isSticky = false }) => {
  return (
    <article 
      onClick={() => onClick(post.slug)}
      className={`relative group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border ${isSticky ? 'border-primary/50 shadow-md shadow-primary/10' : 'border-gray-100 dark:border-zinc-800'} hover:shadow-2xl transition-all duration-300 cursor-pointer`}
    >
      {isSticky && (
        <div className="absolute top-4 right-4 z-10 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
          置顶
        </div>
      )}
      {/* 封面图区域：包含悬停缩放效果 */}
      {post.image && (
        <div className="aspect-video overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
      
      {/* 文字内容区域 */}
      <div className="p-6">
        {/* 分类展示 */}
        <div className="flex items-center space-x-2 mb-2">
          {(post.categories || []).map(cat => (
            <span key={cat} className="px-2 py-0.5 bg-primary text-white rounded text-[9px] font-bold uppercase tracking-wider">
              {cat}
            </span>
          ))}
        </div>
        
        {/* 标签展示：最多展示前两个 */}
        <div className="flex items-center space-x-3 mb-3 text-xs font-medium text-primary">
          {(post.tags || []).slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-1 bg-primary/10 dark:bg-primary/20 text-primary rounded-lg uppercase tracking-wider text-[10px]">
              {tag}
            </span>
          ))}
        </div>
        
        {/* 标题 */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-3 group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        
        {/* 描述：限制展示 3 行文字，超出显示省略号 */}
        <p className="text-gray-500 dark:text-zinc-400 text-sm line-clamp-3 mb-6 transition-colors">
          {post.description}
        </p>
        
        {/* 底部信息：日期与交互提示 */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center text-xs text-gray-400 space-x-4">
            <span className="flex items-center">
              <Calendar size={14} className="mr-1" /> 
              {(() => {
                const d = post.date ? new Date(post.date) : new Date();
                return isNaN(d.getTime()) ? '未知日期' : format(d, 'yyyy年MM月dd日');
              })()}
            </span>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-zinc-100 flex items-center group-hover:translate-x-1 transition-transform">
            阅读更多 <ArrowRight size={16} className="ml-1" />
          </span>
        </div>
      </div>
    </article>
  );
};
