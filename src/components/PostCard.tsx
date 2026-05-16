import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { PostMetadata } from '@/src/types';
import { format } from 'date-fns';

interface PostCardProps {
  post: PostMetadata;
  onClick: (slug: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  return (
    <article 
      onClick={() => onClick(post.slug)}
      className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 hover:shadow-2xl transition-all duration-300 cursor-pointer"
    >
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
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-3 text-xs font-medium text-indigo-500 dark:text-indigo-400">
          {(post.tags || []).slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-3 group-hover:text-indigo-600 transition-colors">
          {post.title}
        </h2>
        <p className="text-gray-500 dark:text-zinc-400 text-sm line-clamp-3 mb-6 transition-colors">
          {post.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center text-xs text-gray-400 space-x-4">
            <span className="flex items-center"><Calendar size={14} className="mr-1" /> {format(new Date(post.date), 'yyyy年MM月dd日')}</span>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-zinc-100 flex items-center group-hover:translate-x-1 transition-transform">
            阅读更多 <ArrowRight size={16} className="ml-1" />
          </span>
        </div>
      </div>
    </article>
  );
};
