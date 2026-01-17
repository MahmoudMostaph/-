import React from 'react';
import { BlogPost } from '../types';
import { PlusIcon, PencilIcon, TrashIcon, SparklesIcon } from './Icons';

interface BlogSectionProps {
  posts: BlogPost[];
  isAdmin: boolean;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  onView: (post: BlogPost) => void;
}

const BlogSection: React.FC<BlogSectionProps> = ({ posts, isAdmin, onEdit, onDelete, onAddNew, onView }) => {
  return (
    <section className="py-12 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
             <div className="bg-yellow-500 p-2 rounded-lg"><SparklesIcon className="w-6 h-6 text-gray-900"/></div>
             <h2 className="text-3xl font-bold">مدونة الرشاقة</h2>
          </div>
          {isAdmin && (
            <button onClick={onAddNew} className="flex items-center space-x-2 rtl:space-x-reverse bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-bold transition-transform active:scale-95 shadow-lg">
              <PlusIcon className="w-5 h-5" />
              <span>مقال جديد</span>
            </button>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-gray-800 rounded-2xl border border-dashed border-gray-700">
            <p className="text-gray-400">لا توجد مقالات منشورة حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <article 
                key={post.id} 
                className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-700/50 flex flex-col group transition-all hover:-translate-y-2 hover:shadow-yellow-500/10"
              >
                <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => onView(post)}>
                  <img 
                    src={post.imageUrl || 'https://picsum.photos/seed/fitness/800/600'} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 right-4 bg-yellow-500 text-gray-900 text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                    {post.date}
                  </div>
                  {isAdmin && (
                    <div className="absolute top-4 left-4 flex space-x-2 rtl:space-x-reverse z-10">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(post); }} 
                        className="p-2 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-500 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4"/>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(post.id); }} 
                        className="p-2 bg-red-600 rounded-full text-white shadow-lg hover:bg-red-500 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4"/>
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 
                    className="text-xl font-bold text-white mb-3 line-clamp-2 cursor-pointer hover:text-yellow-400 transition-colors"
                    onClick={() => onView(post)}
                  >
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>
                  <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-700">
                    <span className="text-xs text-gray-500">بقلم: {post.author}</span>
                    <button 
                      onClick={() => onView(post)}
                      className="text-yellow-400 text-sm font-bold hover:text-yellow-300 transition-colors flex items-center"
                    >
                      <span>اقرأ المزيد</span>
                      <span className="mr-1">←</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;