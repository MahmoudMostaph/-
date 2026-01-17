
import React, { useState, useRef } from 'react';
import { ShoppingCartIcon, WarriorLogoIcon, ChartBarIcon, ArrowRightOnRectangleIcon, ArrowPathIcon, CheckCircleIcon, PencilIcon } from './Icons';

interface HeaderProps {
  onAdminClick: () => void;
  isAdmin: boolean;
  onLogout: () => void;
  cartItemCount: number;
  onCartClick: () => void;
  visitorCount: number;
  onDashboardClick: () => void;
  isDevMode: boolean;
  isSyncing?: boolean;
  logoUrl?: string;
  hasUnsavedChanges?: boolean;
  activeView: 'store' | 'blog';
  onViewChange: (view: 'store' | 'blog') => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onAdminClick, 
  isAdmin, 
  onLogout, 
  cartItemCount, 
  onCartClick, 
  isSyncing,
  logoUrl,
  hasUnsavedChanges,
  activeView,
  onViewChange,
  onDashboardClick
}) => {
  const [clickCount, setClickCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const newCount = clickCount + 1;
    if (newCount >= 3) {
      onAdminClick();
      setClickCount(0);
    } else {
      setClickCount(newCount);
      timerRef.current = setTimeout(() => setClickCount(0), 1500);
    }
  };

  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-40 border-b border-gray-700">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div onClick={handleLogoClick} className="cursor-pointer active:scale-90 transition-transform">
            {logoUrl ? <img src={logoUrl} alt="Logo" className="w-10 h-10 object-contain" /> : <WarriorLogoIcon className="w-10 h-10 text-yellow-400" />}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">حلم الوزن</h1>
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[10px]">
              {isSyncing ? <span className="text-yellow-500 flex items-center"><ArrowPathIcon className="w-3 h-3 animate-spin ml-1"/> جاري المزامنة...</span> : hasUnsavedChanges ? <span className="text-orange-400">مسودة غير منشورة</span> : <span className="text-green-400">متصل وآمن</span>}
            </div>
          </div>
        </div>

        <nav className="hidden md:flex bg-gray-900/50 p-1 rounded-full border border-gray-700">
          <button 
            onClick={() => onViewChange('store')}
            className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${activeView === 'store' ? 'bg-yellow-500 text-gray-900' : 'text-gray-400 hover:text-white'}`}
          >
            المتجر
          </button>
          <button 
            onClick={() => onViewChange('blog')}
            className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${activeView === 'blog' ? 'bg-yellow-500 text-gray-900' : 'text-gray-400 hover:text-white'}`}
          >
            المدونة
          </button>
        </nav>
        
        <div className="flex items-center space-x-2 sm:space-x-4 rtl:space-x-reverse">
          <button onClick={onCartClick} className="relative p-2 text-gray-300 hover:text-white">
            <ShoppingCartIcon className="w-7 h-7" />
            {cartItemCount > 0 && <span className="absolute -top-1 -right-1 h-5 w-5 bg-yellow-500 text-gray-900 text-xs font-bold rounded-full flex items-center justify-center">{cartItemCount}</span>}
          </button>

          {isAdmin && (
            <>
              <button onClick={onDashboardClick} className="bg-blue-600 p-2 rounded-lg text-white"><ChartBarIcon className="w-5 h-5"/></button>
              <button onClick={onLogout} className="bg-red-600 p-2 rounded-lg text-white"><ArrowRightOnRectangleIcon className="w-5 h-5"/></button>
            </>
          )}
        </div>
      </div>
      {/* Mobile Nav */}
      <div className="md:hidden flex justify-center pb-2 px-4">
         <div className="flex w-full bg-gray-900/50 p-1 rounded-lg border border-gray-700">
            <button onClick={() => onViewChange('store')} className={`flex-1 py-2 text-xs font-bold rounded-md ${activeView === 'store' ? 'bg-yellow-500 text-gray-900' : 'text-gray-400'}`}>المتجر</button>
            <button onClick={() => onViewChange('blog')} className={`flex-1 py-2 text-xs font-bold rounded-md ${activeView === 'blog' ? 'bg-yellow-500 text-gray-900' : 'text-gray-400'}`}>المدونة</button>
         </div>
      </div>
    </header>
  );
};

export default Header;
