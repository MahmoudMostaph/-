
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Product, BlogPost, Notification, SiteSettings, DiscountCode } from './types';
import { INITIAL_PRODUCTS, ADMIN_PASSWORD, CONTACT_WHATSAPP } from './constants';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import BlogSection from './components/BlogSection';
import BlogDetailModal from './components/BlogDetailModal';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import PasswordModal from './components/PasswordModal';
import AdminPanel from './components/AdminPanel';
import AdminBlogPanel from './components/AdminBlogPanel';
import ShoppingCart from './components/ShoppingCart';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import NotificationCenter from './components/NotificationCenter';
import Dashboard from './components/Dashboard';
import ProductDetailModal from './components/ProductDetailModal';
import UpdatePrompt from './components/UpdatePrompt';
import { CheckCircleIcon, InformationCircleIcon, FireIcon } from './components/Icons';
import { GoogleGenAI } from '@google/genai';
import Chatbot from './components/Chatbot';

const DEFAULT_SETTINGS: SiteSettings = {
  heroTitle: "مرحباً بكم في حلم الوزن والرشاقة",
  heroSubtitle: "وجهتكم الأولى للرشاقة والمكملات الرياضية في تبوك.",
  heroBannerText: "نضمن لكم أفضل النتائج مع برامجنا المتخصصة ومنتجاتنا الأصلية.",
  lastUpdated: Date.now()
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'store' | 'blog'>('store');
  const [products, setProducts] = useState<Product[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAdminBlogPanelOpen, setIsAdminBlogPanelOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'product' | 'post' | 'discount' } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [viewingPost, setViewingPost] = useState<BlogPost | null>(null);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const lastProcessedTimestamp = useRef<number>(0);
  const saveDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addNotification = useCallback((message: string, type: 'success' | 'info' = 'info') => {
    const id = Date.now();
    const icon = type === 'success' ? <CheckCircleIcon className="w-6 h-6 text-green-400" /> : <InformationCircleIcon className="w-6 h-6 text-blue-400" />;
    setNotifications(prev => [...prev, { id, message, type, icon }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  }, []);

  const hideLoader = useCallback(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 500);
    }
  }, []);

  // جلب البيانات مع حماية المسودة المحلية
  const fetchServerData = useCallback(async () => {
    // إذا كان هناك تعديلات غير منشورة، لا تجلب بيانات السيرفر لكي لا تضيع تعديلات الأدمن
    const localChanges = localStorage.getItem('hasUnsavedChanges') === 'true';
    if (localChanges) {
      setIsSyncing(false);
      hideLoader();
      return; 
    }

    setIsSyncing(true);
    try {
      const response = await fetch('site-data.json?t=' + Date.now());
      if (response.ok) {
        const data = await response.json();
        const serverTS = data.settings?.lastUpdated || 0;

        if (serverTS > lastProcessedTimestamp.current) {
            setProducts(data.products || INITIAL_PRODUCTS);
            setBlogPosts(data.blogPosts || []);
            setSettings(data.settings || DEFAULT_SETTINGS);
            setDiscountCodes(data.discountCodes || []);
            lastProcessedTimestamp.current = serverTS;
        }
      }
    } catch (e) {
      console.warn("Offline mode.");
    } finally {
      setIsSyncing(false);
      hideLoader();
    }
  }, [hideLoader]);

  useEffect(() => {
    // 1. تحميل المسودة المحلية أولاً (الأولوية القصوى)
    const localProducts = localStorage.getItem('products');
    const localSettings = localStorage.getItem('siteSettings');
    const localBlog = localStorage.getItem('blogPosts');
    const localDiscounts = localStorage.getItem('discountCodes');
    const localChanges = localStorage.getItem('hasUnsavedChanges') === 'true';

    if (localChanges && localProducts) {
      setProducts(JSON.parse(localProducts));
      if (localSettings) setSettings(JSON.parse(localSettings));
      if (localBlog) setBlogPosts(JSON.parse(localBlog));
      if (localDiscounts) setDiscountCodes(JSON.parse(localDiscounts));
      setHasUnsavedChanges(true);
      hideLoader(); // إخفاء اللودر فوراً لأننا نملك البيانات محلياً
    } else {
      // 2. إذا لم توجد مسودة، اذهب للسيرفر
      fetchServerData();
    }
  }, [fetchServerData, hideLoader]);

  // حفظ المسودة (Debounced) لتجنب اللاج
  useEffect(() => {
    if (saveDebounceRef.current) clearTimeout(saveDebounceRef.current);
    
    saveDebounceRef.current = setTimeout(() => {
      if (hasUnsavedChanges) {
        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('siteSettings', JSON.stringify(settings));
        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
        localStorage.setItem('discountCodes', JSON.stringify(discountCodes));
        localStorage.setItem('hasUnsavedChanges', 'true');
      }
    }, 1000);

    return () => { if (saveDebounceRef.current) clearTimeout(saveDebounceRef.current); };
  }, [products, blogPosts, settings, discountCodes, hasUnsavedChanges]);

  const handleSaveProduct = (updatedProduct: Omit<Product, 'id'> & { id?: string }) => {
    setHasUnsavedChanges(true);
    // تحديث الحالة فوراً في الـ RAM ليظهر في الواجهة في نفس اللحظة
    setProducts(prev => {
      if (updatedProduct.id) {
        const index = prev.findIndex(p => p.id === updatedProduct.id);
        if (index === -1) return prev;
        const newProducts = [...prev];
        newProducts[index] = { ...updatedProduct, id: updatedProduct.id! };
        return newProducts;
      } else {
        return [{ ...updatedProduct, id: Date.now().toString() }, ...prev];
      }
    });
    
    addNotification('تم تحديث العرض في الواجهة بنجاح.', 'success');
    setIsAdminPanelOpen(false);
  };

  const handleExportData = () => {
    const payload = { settings: { ...settings, lastUpdated: Date.now() }, products, blogPosts, discountCodes };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'site-data.json';
    link.click();
    URL.revokeObjectURL(url);
    
    setHasUnsavedChanges(false);
    localStorage.setItem('hasUnsavedChanges', 'false');
    addNotification('تم تصدير ملف النشر المعتمد.', 'success');
  };

  const cartCount = useMemo(() => Array.from(cart.values()).reduce((a: number, b: number) => a + b, 0), [cart]);

  return (
    <div className="bg-gray-950 text-white min-h-screen font-sans overflow-x-hidden selection:bg-yellow-500 selection:text-black" dir="rtl">
      <NotificationCenter notifications={notifications} />
      
      {isAdmin && hasUnsavedChanges && (
        <div className="bg-yellow-500 text-black text-center py-2 text-[10px] font-black sticky top-0 z-[100] shadow-2xl flex items-center justify-center gap-2">
          <FireIcon className="w-4 h-4 animate-pulse" />
          <span>تنبيه: التعديلات ظاهرة الآن في متصفحك فقط. يجب ضغط "نشر للجمهور" في لوحة التحكم لتحديث الموقع للجميع.</span>
        </div>
      )}

      <Header 
        onAdminClick={() => setIsPasswordModalOpen(true)} 
        isAdmin={isAdmin} 
        onLogout={() => { if(confirm('تنبيه: سيتم تسجيل الخروج ومسح المسودة غير المنشورة.')) { localStorage.clear(); window.location.reload(); } }} 
        cartItemCount={cartCount} 
        onCartClick={() => setIsCartOpen(true)} 
        visitorCount={0} 
        onDashboardClick={() => setIsDashboardOpen(true)} 
        isDevMode={true} 
        isSyncing={isSyncing} 
        logoUrl={settings.logoUrl}
        hasUnsavedChanges={hasUnsavedChanges}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      <main className="relative">
        <Hero title={settings.heroTitle} subtitle={settings.heroSubtitle} bannerText={settings.heroBannerText} />
        
        {activeView === 'store' ? (
          <ProductGrid 
            products={products} isAdmin={isAdmin} 
            onEdit={p => { setEditingProduct(p); setIsAdminPanelOpen(true); }} 
            onDelete={id => setItemToDelete({ id, type: 'product' })} 
            onAddToCart={id => {
               const p = products.find(x => x.id === id);
               if(p && ((cart.get(id) as number) || 0) < p.stock) {
                 const n = new Map<string, number>(cart); n.set(id, ((n.get(id) as number) || 0) + 1); setCart(n);
               }
            }} 
            onAddNew={() => { setEditingProduct(null); setIsAdminPanelOpen(true); }} 
            cart={cart} onUpdateQuantity={(id, q) => {
              const n = new Map<string, number>(cart); if(q<=0) n.delete(id); else n.set(id, q); setCart(n);
            }} 
            isDevMode={true} onView={p => setViewingProduct(p)} 
          />
        ) : (
          <BlogSection posts={blogPosts} isAdmin={isAdmin} onEdit={p => {setEditingPost(p); setIsAdminBlogPanelOpen(true);}} onDelete={id => setItemToDelete({id, type: 'post'})} onAddNew={() => {setEditingPost(null); setIsAdminBlogPanelOpen(true);}} onView={setViewingPost} />
        )}
      </main>

      <Footer />
      {!isChatbotOpen && <WhatsAppButton phoneNumber={CONTACT_WHATSAPP} />}
      
      {isPasswordModalOpen && <PasswordModal onClose={() => setIsPasswordModalOpen(false)} onSubmit={(p) => {
        if(p === ADMIN_PASSWORD) { setIsAdmin(true); setIsPasswordModalOpen(false); addNotification('مرحباً بك في لوحة الإدارة.', 'success'); }
        else setPasswordError('الرمز السري غير صحيح.');
      }} error={passwordError} />}

      {isAdminPanelOpen && (
        <AdminPanel 
          product={editingProduct} onClose={() => setIsAdminPanelOpen(false)} onSave={handleSaveProduct}
          onGenerateDescription={async (name) => {
            setIsGeneratingContent(true);
            try {
              const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
              const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: `اكتب وصفاً تسويقياً لـ: ${name}` });
              return res.text || "";
            } finally { setIsGeneratingContent(false); }
          }}
          isGeneratingDescription={isGeneratingContent}
        />
      )}

      {isAdminBlogPanelOpen && (
        <AdminBlogPanel post={editingPost} onClose={() => setIsAdminBlogPanelOpen(false)} onSave={(p) => {
          setHasUnsavedChanges(true);
          if(p.id) setBlogPosts(prev => prev.map(x => x.id === p.id ? {...p, id: p.id!} : x));
          else setBlogPosts(prev => [{...p, id: Date.now().toString(), date: new Date().toLocaleDateString('ar-SA')}, ...prev]);
          setIsAdminBlogPanelOpen(false);
        }} onGenerateContent={async (t) => {
          setIsGeneratingContent(true);
          try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: `اكتب مقالاً عن: ${t}` });
            return res.text || "";
          } finally { setIsGeneratingContent(false); }
        }} isGenerating={isGeneratingContent} />
      )}

      {isDashboardOpen && (
        <Dashboard 
          onClose={() => setIsDashboardOpen(false)} settings={settings}
          onSaveSettings={(s) => { setSettings({...s, lastUpdated: Date.now()}); setHasUnsavedChanges(true); addNotification('تم تحديث هوية المتجر.', 'success'); }}
          hasUnsavedChanges={hasUnsavedChanges}
          onDiscardChanges={() => { if(confirm('هل تريد إلغاء المسودة الحالية والعودة لآخر نسخة منشورة؟')) { localStorage.clear(); window.location.reload(); } }}
          onExport={handleExportData}
          onImport={(e) => {
             const file = e.target.files?.[0]; if(!file) return;
             const reader = new FileReader();
             reader.onload = (ev) => {
               try {
                 const d = JSON.parse(ev.target?.result as string);
                 if(d.products) setProducts(d.products);
                 if(d.settings) setSettings(d.settings);
                 setHasUnsavedChanges(true); addNotification('تم استيراد البيانات.', 'success');
               } catch (err) { addNotification('الملف غير صالح.', 'info'); }
             };
             reader.readAsText(file);
          }}
          stats={{ productCount: products.length, blogCount: blogPosts.length, products }}
          discountCodes={discountCodes}
          onUpdateDiscounts={(c) => { setDiscountCodes(c); setHasUnsavedChanges(true); }}
          onDeleteDiscount={(id) => setItemToDelete({id, type: 'discount'})}
        />
      )}

      {itemToDelete && (
        <DeleteConfirmModal onClose={() => setItemToDelete(null)} onConfirm={() => {
           if(itemToDelete.type === 'product') setProducts(products.filter(p => p.id !== itemToDelete.id));
           if(itemToDelete.type === 'post') setBlogPosts(blogPosts.filter(p => p.id !== itemToDelete.id));
           setHasUnsavedChanges(true);
        }} />
      )}

      {viewingProduct && <ProductDetailModal product={viewingProduct} onClose={() => setViewingProduct(null)} cart={cart} onUpdateQuantity={(id, q) => {
          const n = new Map<string, number>(cart); if(q<=0) n.delete(id); else n.set(id, q); setCart(n);
      }} onViewProduct={setViewingProduct} recommendations={products.slice(0,3)} isLoadingRecs={false} />}
      
      {viewingPost && <BlogDetailModal post={viewingPost} onClose={() => setViewingPost(null)} />}
      
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} products={products} onUpdateQuantity={(id, q) => {
          const n = new Map<string, number>(cart); if(q<=0) n.delete(id); else n.set(id, q); setCart(n);
      }} onClearCart={() => setCart(new Map())} discountCodes={discountCodes} />
      
      <Chatbot products={products} isOpen={isChatbotOpen} onToggle={() => setIsChatbotOpen(!isChatbotOpen)} />
    </div>
  );
};

export default App;
