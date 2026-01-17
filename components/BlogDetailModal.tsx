import React from 'react';
import { BlogPost } from '../types';
import { XMarkIcon, SparklesIcon } from './Icons';

interface BlogDetailModalProps {
  post: BlogPost;
  onClose: () => void;
}

const BlogDetailModal: React.FC<BlogDetailModalProps> = ({ post, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Close Button */}
        <header className="absolute top-4 right-4 left-4 flex justify-between items-center z-10 pointer-events-none">
           <div className="pointer-events-auto bg-gray-900/50 backdrop-blur-md p-1.5 rounded-full border border-white/10 text-white/80">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider">{post.author}</span>
           </div>
           <button 
            onClick={onClose}
            className="pointer-events-auto p-2 bg-gray-900/50 backdrop-blur-md hover:bg-red-500 rounded-full text-white transition-all shadow-xl"
           >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-grow scrollbar-hide">
          {/* Cover Image */}
          <div className="relative h-64 md:h-96 w-full">
            <img 
              src={post.imageUrl || 'https://picsum.photos/seed/fitness/1200/800'} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
            <div className="absolute bottom-6 right-6">
                <span className="bg-yellow-500 text-gray-900 text-xs font-black px-4 py-1.5 rounded-full shadow-lg">
                    {post.date}
                </span>
            </div>
          </div>

          {/* Article Body */}
          <article className="px-6 md:px-12 py-8 md:py-12">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4 text-yellow-500">
               <SparklesIcon className="w-5 h-5" />
               <span className="text-sm font-bold tracking-widest uppercase">مقالات حلم الوزن</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight">
              {post.title}
            </h1>

            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* Author Footer */}
            <div className="mt-12 pt-8 border-t border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-gray-900 font-bold text-xl">
                  {post.author[0]}
                </div>
                <div>
                  <p className="text-white font-bold">{post.author}</p>
                  <p className="text-gray-500 text-sm">كاتب في مدونة الرشاقة</p>
                </div>
              </div>
              
              <button 
                onClick={onClose}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-xl font-bold transition-colors"
              >
                عودة للمدونة
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailModal;