
import React, { useState, useEffect, useRef } from 'react';
import { Product, ProductCategory } from '../types';
import { SparklesIcon, XMarkIcon, PhotoIcon } from './Icons';

interface AdminPanelProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id'> & { id?: string }) => void;
  onGenerateDescription: (productName: string) => Promise<string>;
  isGeneratingDescription: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ product, onClose, onSave, onGenerateDescription, isGeneratingDescription }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    price: '' as number | '',
    salePrice: '' as number | '',
    category: 'athlete' as ProductCategory,
    stock: 0 as number | ''
  });

  const [imagePreview, setImagePreview] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price,
        salePrice: product.salePrice || '',
        category: product.category,
        stock: product.stock
      });
      setImagePreview(product.imageUrl);
    }
  }, [product]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // معاينة فورية للمستخدم لإلغاء الشعور باللاج
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      
      setIsProcessingImage(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData(prev => ({ ...prev, imageUrl: base64 }));
        setIsProcessingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.price === '' || formData.name.trim() === '' || isProcessingImage) return;
    onSave({
      id: product?.id,
      ...formData,
      price: Number(formData.price),
      salePrice: formData.salePrice !== '' ? Number(formData.salePrice) : undefined,
      stock: Number(formData.stock) || 0,
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[130] p-4 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#111827] rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.9)] w-full max-w-2xl max-h-[95vh] overflow-y-auto p-10 border border-white/10 animate-in zoom-in-95 duration-500">
        <div className="flex justify-between items-center mb-10">
            <div>
                <h2 className="text-3xl font-black text-white">{product ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">تحديث السعر والصورة والوصف</p>
            </div>
            <button onClick={onClose} className="p-3 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-full transition-all text-gray-500">
                <XMarkIcon className="w-6 h-6" />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">اسم المنتج</label>
                      <input
                        type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full bg-black/40 border-2 border-white/5 text-white rounded-2xl px-5 py-4 focus:border-yellow-500 outline-none transition-all font-bold"
                        required
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                         <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">وصف المنتج</label>
                         <button 
                          type="button" onClick={async () => handleChange('description', await onGenerateDescription(formData.name))}
                          disabled={isGeneratingDescription || !formData.name}
                          className="flex items-center gap-2 text-[9px] font-black bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-full hover:bg-yellow-500/20 disabled:opacity-50 transition-all border border-yellow-500/20"
                         >
                           <SparklesIcon className="w-3 h-3" />
                           <span>{isGeneratingDescription ? 'جاري التوليد...' : 'ذكاء اصطناعي'}</span>
                         </button>
                      </div>
                      <textarea
                        value={formData.description} onChange={(e) => handleChange('description', e.target.value)}
                        className="w-full bg-black/40 border-2 border-white/5 text-white rounded-2xl px-5 py-4 focus:border-yellow-500 outline-none h-40 resize-none leading-relaxed font-medium text-sm"
                        required
                      />
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">صورة المنتج</label>
                      <div className="relative group overflow-hidden bg-black/40 border-2 border-white/5 border-dashed rounded-[2rem] aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500/50 transition-all">
                          {imagePreview ? (
                              <>
                                <img src={imagePreview} className={`absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${isProcessingImage ? 'opacity-50' : 'opacity-100'}`} />
                                {isProcessingImage && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                    <PhotoIcon className="w-8 h-8 text-white" />
                                    <span className="text-[10px] font-black text-white uppercase">تغيير الصورة</span>
                                </div>
                              </>
                          ) : (
                              <>
                                <PhotoIcon className="w-12 h-12 text-gray-700 mb-2" />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">اختر ملف الصورة</span>
                              </>
                          )}
                          <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">السعر</label>
                  <input
                    type="number" value={formData.price} onChange={(e) => handleChange('price', e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-black/40 border-2 border-white/5 text-white rounded-2xl px-5 py-4 outline-none focus:border-yellow-500 font-bold"
                    required min="0"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">سعر العرض</label>
                  <input
                    type="number" value={formData.salePrice} onChange={(e) => handleChange('salePrice', e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-black/40 border-2 border-white/5 text-white rounded-2xl px-5 py-4 outline-none focus:border-yellow-500 font-bold"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">الفئة</label>
                  <select
                    value={formData.category} onChange={(e) => handleChange('category', e.target.value as ProductCategory)}
                    className="w-full bg-black/40 border-2 border-white/5 text-white rounded-2xl px-5 py-4 outline-none focus:border-yellow-500 font-bold cursor-pointer"
                  >
                    <option value="athlete">رياضيين</option>
                    <option value="slimming">تنحيف</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">المخزون</label>
                  <input
                    type="number" value={formData.stock} onChange={(e) => handleChange('stock', e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-black/40 border-2 border-white/5 text-white rounded-2xl px-5 py-4 outline-none focus:border-yellow-500 font-bold"
                    required min="0"
                  />
                </div>
            </div>
          
          <div className="flex gap-4 pt-10">
            <button type="button" onClick={onClose} className="flex-1 bg-white/5 py-6 rounded-2xl font-black text-gray-400 hover:text-white hover:bg-white/10 transition-all">تجاهل</button>
            <button type="submit" disabled={isProcessingImage} className="flex-[2] bg-yellow-500 text-black py-6 rounded-2xl font-black text-xl hover:bg-yellow-400 transition-all shadow-2xl shadow-yellow-500/20 active:scale-95 disabled:opacity-50">حفظ في المسودة</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
