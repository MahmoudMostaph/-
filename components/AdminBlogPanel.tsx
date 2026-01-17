
import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { SparklesIcon, XMarkIcon, PhotoIcon } from './Icons';

interface AdminBlogPanelProps {
  post: BlogPost | null;
  onClose: () => void;
  onSave: (post: Omit<BlogPost, 'id'> & { id?: string }) => void;
  onGenerateContent: (title: string) => Promise<string>;
  isGenerating: boolean;
}

const AdminBlogPanel: React.FC<AdminBlogPanelProps> = ({ post, onClose, onSave, onGenerateContent, isGenerating }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [author, setAuthor] = useState('إدارة المركز');

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setImageUrl(post.imageUrl);
      setAuthor(post.author);
    }
  }, [post]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: post?.id, title, content, imageUrl, author, date: post?.date || '' });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 border border-gray-700 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-2xl font-bold">{post ? 'تعديل المقال' : 'نشر مقال جديد'}</h2>
           <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full transition-colors"><XMarkIcon className="w-6 h-6 text-gray-400"/></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">عنوان المقال</label>
            <input 
              type="text" value={title} onChange={e => setTitle(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none text-white" 
              placeholder="مثلاً: أهمية البروتين للرياضيين"
              required 
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-400">محتوى المقال</label>
              <button 
                type="button" onClick={async () => setContent(await onGenerateContent(title))}
                disabled={isGenerating || !title}
                className="flex items-center space-x-1 rtl:space-x-reverse text-xs bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full hover:bg-yellow-500/30 transition-all disabled:opacity-50"
              >
                <SparklesIcon className="w-4 h-4" />
                <span>{isGenerating ? 'جاري الكتابة...' : 'اكتب لي بالذكاء الاصطناعي'}</span>
              </button>
            </div>
            <textarea 
              value={content} onChange={e => setContent(e.target.value)} rows={8}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none resize-none text-white leading-relaxed" 
              placeholder="اكتب تفاصيل المقال هنا أو استخدم الذكاء الاصطناعي..."
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">اسم الكاتب</label>
                <input 
                  type="text" value={author} onChange={e => setAuthor(e.target.value)} 
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white" 
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">صورة المقال</label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden" 
                    id="blog-image-upload"
                  />
                  <label 
                    htmlFor="blog-image-upload"
                    className="flex items-center justify-center space-x-2 rtl:space-x-reverse w-full bg-gray-900 border border-gray-700 border-dashed rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-700 transition-colors text-gray-400"
                  >
                    <PhotoIcon className="w-5 h-5" />
                    <span>{imageUrl ? 'تغيير الصورة' : 'رفع من المعرض'}</span>
                  </label>
                </div>
             </div>
          </div>

          {imageUrl && (
            <div className="relative rounded-xl overflow-hidden border border-gray-700">
              <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover" />
              <button 
                type="button" 
                onClick={() => setImageUrl('')}
                className="absolute top-2 left-2 bg-red-600 p-1 rounded-full text-white shadow-lg"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex gap-4 pt-6">
             <button type="button" onClick={onClose} className="flex-1 bg-gray-700 py-3 rounded-xl font-bold hover:bg-gray-600 transition-colors">إلغاء</button>
             <button type="submit" className="flex-1 bg-yellow-500 text-gray-900 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors">نشر المقال</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminBlogPanel;
