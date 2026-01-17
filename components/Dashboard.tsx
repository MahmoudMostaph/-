
import React, { useState, useEffect } from 'react';
import { Product, SiteSettings, DiscountCode } from '../types';
import { 
  XMarkIcon, ChartBarIcon, ShoppingCartIcon, ArrowDownTrayIcon, 
  SparklesIcon, PlusIcon, TrashIcon, CheckCircleIcon, 
  CodeBracketIcon, TagIcon, FireIcon, ArrowUpTrayIcon,
  PencilIcon, EyeIcon, MapPinIcon, ChevronRightIcon,
  CheckIcon
} from './Icons';

interface DashboardProps {
  onClose: () => void;
  stats: {
    productCount: number;
    blogCount: number;
    products: Product[];
  };
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  settings: SiteSettings;
  onSaveSettings: (settings: SiteSettings) => void;
  hasUnsavedChanges: boolean;
  onDiscardChanges: () => void;
  discountCodes: DiscountCode[];
  onUpdateDiscounts: (codes: DiscountCode[]) => void;
  onDeleteDiscount: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  onClose, stats, onExport, onImport, settings, 
  onSaveSettings, hasUnsavedChanges, onDiscardChanges, 
  discountCodes, onUpdateDiscounts, onDeleteDiscount 
}) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'discounts' | 'publish'>('overview');
    const [tempSettings, setTempSettings] = useState<SiteSettings>(settings);
    
    // Discount Form State
    const [newDiscount, setNewDiscount] = useState({ code: '', type: 'percentage' as 'percentage' | 'fixed', value: '' });

    useEffect(() => {
        setTempSettings(settings);
    }, [settings]);

    const handleAddDiscount = () => {
        if (!newDiscount.code || !newDiscount.value) return;
        const code: DiscountCode = {
            id: Date.now().toString(),
            code: newDiscount.code.toUpperCase(),
            type: newDiscount.type,
            value: Number(newDiscount.value),
            isActive: true
        };
        onUpdateDiscounts([...discountCodes, code]);
        setNewDiscount({ code: '', type: 'percentage', value: '' });
    };

    const tabs = [
        { id: 'overview', label: 'الرئيسية', icon: <ChartBarIcon className="w-5 h-5"/> },
        { id: 'settings', label: 'الهوية', icon: <PencilIcon className="w-5 h-5"/> },
        { id: 'discounts', label: 'العروض', icon: <TagIcon className="w-5 h-5"/> },
        { id: 'publish', label: 'النشر', icon: <FireIcon className="w-5 h-5"/> },
    ];

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[150] flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
            <div className="bg-[#0f172a] border border-white/10 w-full max-w-6xl h-full md:h-[85vh] md:rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-500">
                
                {/* Sidebar - Modern Vertical Design */}
                <aside className="w-full md:w-80 bg-slate-900/50 border-b md:border-b-0 md:border-l border-white/5 p-8 flex flex-col gap-12">
                    <div className="flex items-center gap-4 group">
                        <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-[1.25rem] flex items-center justify-center text-black shadow-lg shadow-yellow-500/20 group-hover:rotate-12 transition-transform duration-500">
                            <FireIcon className="w-8 h-8 font-black"/>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight">لوحة الإدارة</h2>
                            <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-[0.2em]">Dream Weight Center</p>
                        </div>
                    </div>

                    <nav className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-4 md:pb-0 no-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all whitespace-nowrap text-sm font-bold ${activeTab === tab.id ? 'bg-white/10 text-yellow-400 shadow-inner' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <span className={activeTab === tab.id ? 'text-yellow-400' : 'text-slate-500'}>{tab.icon}</span>
                                <span>{tab.label}</span>
                                {tab.id === 'publish' && hasUnsavedChanges && (
                                    <span className="mr-auto w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto hidden md:block">
                        <div className="bg-gradient-to-br from-white/5 to-transparent p-6 rounded-[2rem] border border-white/10">
                            <p className="text-[10px] font-black text-slate-500 mb-4 uppercase tracking-widest">حالة النظام</p>
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${hasUnsavedChanges ? 'bg-orange-500' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]'}`}></div>
                                <span className="text-xs font-bold text-white">{hasUnsavedChanges ? 'تعديلات معلقة' : 'النظام مستقر'}</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Viewport */}
                <main className="flex-grow flex flex-col min-h-0 relative">
                    <header className="px-10 py-8 flex justify-between items-center bg-slate-900/20 border-b border-white/5">
                        <h3 className="text-2xl font-black text-white flex items-center gap-4">
                            {tabs.find(t => t.id === activeTab)?.label}
                            <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-slate-500 font-bold uppercase tracking-tighter">v3.5 Professional</span>
                        </h3>
                        <button onClick={onClose} className="p-3 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-all group">
                            <XMarkIcon className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </header>

                    <div className="flex-grow p-10 overflow-y-auto custom-scrollbar">
                        {activeTab === 'overview' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    {[
                                        { label: 'المنتجات النشطة', val: stats.productCount, icon: <ShoppingCartIcon className="w-6 h-6"/>, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                                        { label: 'أكواد الخصم', val: discountCodes.length, icon: <TagIcon className="w-6 h-6"/>, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                                        { label: 'مقالات المدونة', val: stats.blogCount, icon: <SparklesIcon className="w-6 h-6"/>, color: 'text-amber-400', bg: 'bg-amber-400/10' }
                                    ].map((stat, i) => (
                                        <div key={i} className={`${stat.bg} border border-white/5 p-8 rounded-[2rem] flex items-center justify-between group hover:scale-[1.02] transition-transform`}>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">{stat.label}</p>
                                                <h4 className="text-4xl font-black text-white">{stat.val}</h4>
                                            </div>
                                            <div className={`${stat.color} p-4 bg-black/20 rounded-2xl`}>{stat.icon}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Recent Products List */}
                                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                                    <div className="p-8 border-b border-white/5 flex justify-between items-center">
                                        <h4 className="text-lg font-black text-white">المخزون الحالي</h4>
                                        <span className="text-xs text-slate-500">آخر 5 منتجات</span>
                                    </div>
                                    <div className="p-4 space-y-2">
                                        {stats.products.slice(0, 5).map(p => (
                                            <div key={p.id} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-all group">
                                                <img src={p.imageUrl} className="w-14 h-14 rounded-2xl object-cover bg-black shadow-xl" />
                                                <div className="flex-grow">
                                                    <p className="text-sm font-black text-white group-hover:text-yellow-400 transition-colors">{p.name}</p>
                                                    <p className="text-xs text-slate-500 mt-1">{p.category === 'athlete' ? 'رياضيين' : 'تنحيف'}</p>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-black text-yellow-500">{p.price} ريال</p>
                                                    <p className={`text-[10px] font-bold ${p.stock < 5 ? 'text-red-400' : 'text-slate-500'}`}>{p.stock} في المخزن</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-500">
                                <div className="bg-slate-900/40 p-12 rounded-[3rem] border border-white/10 shadow-2xl space-y-10">
                                    <div className="grid gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">عنوان المتجر الرئيسي</label>
                                            <input 
                                                type="text" 
                                                value={tempSettings.heroTitle} 
                                                onChange={e => setTempSettings({...tempSettings, heroTitle: e.target.value})} 
                                                className="w-full bg-black/40 border-2 border-white/5 p-6 rounded-2xl outline-none text-white text-xl font-bold focus:border-yellow-500 transition-all placeholder:text-slate-700"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">الوصف الترحيبي</label>
                                            <textarea 
                                                value={tempSettings.heroSubtitle} 
                                                onChange={e => setTempSettings({...tempSettings, heroSubtitle: e.target.value})} 
                                                rows={4} 
                                                className="w-full bg-black/40 border-2 border-white/5 p-6 rounded-2xl outline-none text-white focus:border-yellow-500 transition-all leading-relaxed font-medium text-sm"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">نص شريط العروض (Banner)</label>
                                            <input 
                                                type="text" 
                                                value={tempSettings.heroBannerText} 
                                                onChange={e => setTempSettings({...tempSettings, heroBannerText: e.target.value})} 
                                                className="w-full bg-black/40 border-2 border-white/5 p-6 rounded-2xl outline-none text-white font-bold focus:border-yellow-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => onSaveSettings(tempSettings)} 
                                        className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black py-6 rounded-[1.5rem] font-black text-lg hover:shadow-[0_10px_30px_rgba(245,158,11,0.3)] transition-all active:scale-95"
                                    >
                                        حفظ التعديلات البصرية
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'discounts' && (
                            <div className="space-y-10 animate-in fade-in duration-500">
                                {/* Add Discount Form */}
                                <div className="bg-emerald-500/5 border border-emerald-500/10 p-10 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase">كود الخصم</label>
                                        <input type="text" placeholder="DREAM10" value={newDiscount.code} onChange={e => setNewDiscount({...newDiscount, code: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 p-4 rounded-xl outline-none text-white font-black uppercase focus:border-emerald-500"/>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase">النوع</label>
                                        <select value={newDiscount.type} onChange={e => setNewDiscount({...newDiscount, type: e.target.value as any})} className="w-full bg-black/40 border-2 border-white/5 p-4 rounded-xl outline-none text-white font-bold appearance-none cursor-pointer">
                                            <option value="percentage">نسبة مئوية (%)</option>
                                            <option value="fixed">مبلغ ثابت (ريال)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase">القيمة</label>
                                        <input type="number" placeholder="10" value={newDiscount.value} onChange={e => setNewDiscount({...newDiscount, value: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 p-4 rounded-xl outline-none text-white font-black focus:border-emerald-500"/>
                                    </div>
                                    <button onClick={handleAddDiscount} className="bg-emerald-500 text-black p-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20">
                                        <PlusIcon className="w-5 h-5"/> إضافة العرض
                                    </button>
                                </div>

                                {/* Active Discounts List */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {discountCodes.map(code => (
                                        <div key={code.id} className="bg-white/5 border border-white/5 p-6 rounded-2xl flex items-center justify-between group">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-emerald-500">
                                                    <TagIcon className="w-6 h-6"/>
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-white">{code.code}</p>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase">خصم {code.value} {code.type === 'percentage' ? '%' : 'ريال'}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => onDeleteDiscount(code.id)} className="p-3 text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                                <TrashIcon className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'publish' && (
                            <div className="animate-in fade-in duration-700 space-y-12">
                                <div className={`p-16 rounded-[3.5rem] border-2 transition-all relative overflow-hidden ${hasUnsavedChanges ? 'bg-amber-500/5 border-amber-500/20 shadow-[0_20px_60px_rgba(245,158,11,0.1)]' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                                    <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                                        <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center flex-shrink-0 shadow-2xl ${hasUnsavedChanges ? 'bg-amber-500 text-black animate-pulse' : 'bg-emerald-500 text-white'}`}>
                                            {hasUnsavedChanges ? <FireIcon className="w-16 h-16" /> : <CheckIcon className="w-16 h-16" />}
                                        </div>
                                        <div className="flex-grow text-center md:text-right">
                                            <h3 className={`text-4xl font-black mb-4 ${hasUnsavedChanges ? 'text-amber-500' : 'text-emerald-500'}`}>
                                                {hasUnsavedChanges ? 'لديك مسودة جاهزة للنشر!' : 'كل البيانات محدثة'}
                                            </h3>
                                            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl font-medium">
                                                {hasUnsavedChanges 
                                                    ? 'قمت بتعديلات جديدة تظهر لك فقط الآن. لمشاركتها مع الجمهور، اضغط تحميل وارفع الملف للسيرفر.' 
                                                    : 'المتجر يعمل حالياً بآخر نسخة قمت برفعها. لا توجد تغييرات معلقة.'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-16 flex flex-col md:flex-row gap-6 justify-center md:justify-end relative z-10">
                                        <button 
                                            onClick={onExport} 
                                            disabled={!hasUnsavedChanges} 
                                            className={`group flex items-center gap-4 px-14 py-6 rounded-[2rem] font-black text-xl transition-all active:scale-95 ${hasUnsavedChanges ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_15px_40px_rgba(245,158,11,0.3)]' : 'bg-white/5 text-slate-700 cursor-not-allowed'}`}
                                        >
                                            <ArrowDownTrayIcon className="w-7 h-7 group-hover:translate-y-1 transition-transform"/> 
                                            تحميل ملف النشر (JSON)
                                        </button>
                                        {hasUnsavedChanges && (
                                            <button onClick={onDiscardChanges} className="px-8 py-4 text-xs font-black text-red-500 hover:bg-red-500/10 rounded-2xl transition-all uppercase tracking-[0.2em]">إلغاء المسودة</button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="bg-slate-900/40 p-12 rounded-[3rem] border border-white/5">
                                        <h4 className="text-blue-400 font-black flex items-center gap-3 mb-10 uppercase tracking-widest text-xs">
                                            <CodeBracketIcon className="w-6 h-6" /> بروتوكول التحديث
                                        </h4>
                                        <div className="space-y-8">
                                            <div className="flex gap-6">
                                                <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center font-black flex-shrink-0 text-sm shadow-lg shadow-blue-500/20">1</div>
                                                <p className="text-sm text-slate-400 leading-relaxed font-medium">حمل ملف <code className="bg-white/5 px-2 py-1 rounded text-blue-300">site-data.json</code> المحتوي على تعديلاتك.</p>
                                            </div>
                                            <div className="flex gap-6">
                                                <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center font-black flex-shrink-0 text-sm shadow-lg shadow-blue-500/20">2</div>
                                                <p className="text-sm text-slate-400 leading-relaxed font-medium">استبدل الملف الموجود في الاستضافة بهذا الملف الجديد ليراه الجميع.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-900/40 p-12 rounded-[3rem] border border-white/5 flex flex-col justify-center items-center text-center border-dashed border-2">
                                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/5">
                                            <ArrowUpTrayIcon className="w-10 h-10 text-slate-600" />
                                        </div>
                                        <h4 className="text-xl font-black text-white mb-3">استيراد نسخة احتياطية</h4>
                                        <p className="text-xs text-slate-500 mb-8 max-w-xs leading-relaxed">يمكنك رفع أي ملف JSON قديم لاستعادة المنتجات والعروض السابقة.</p>
                                        <label className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-2xl font-black text-xs cursor-pointer transition-all border border-white/10 uppercase tracking-widest active:scale-95">
                                            اختيار ملف JSON
                                            <input type="file" className="hidden" accept=".json" onChange={onImport} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
