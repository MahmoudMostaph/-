
import React, { useState } from 'react';
import { Product, DiscountCode } from '../types';
import { XMarkIcon, PlusIcon, MinusIcon, TrashIcon, ShoppingCartIcon, WhatsAppIcon, TagIcon, CheckCircleIcon } from './Icons';
import { CONTACT_WHATSAPP } from '../constants';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Map<string, number>;
  products: Product[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  discountCodes: DiscountCode[];
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onClose, cart, products, onUpdateQuantity, onClearCart, discountCodes }) => {
  const [promoInput, setPromoInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const cartItems = Array.from(cart.entries())
    .map(([productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      if (!product) return null;
      return { product, quantity };
    })
    .filter(Boolean) as { product: Product; quantity: number }[];

  const subtotal = cartItems.reduce((total, item) => {
    const price = item.product.salePrice || item.product.price;
    return total + price * item.quantity;
  }, 0);

  let discountAmount = 0;
  if (appliedDiscount) {
      if (appliedDiscount.type === 'percentage') {
          discountAmount = (subtotal * appliedDiscount.value) / 100;
      } else {
          discountAmount = appliedDiscount.value;
      }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = () => {
      setPromoError('');
      const code = discountCodes.find(c => c.code === promoInput.toUpperCase());
      
      if (!code) {
          setPromoError('الكود غير موجود');
          setAppliedDiscount(null);
      } else if (!code.isActive) {
          setPromoError('هذا الكود منتهي الصلاحية');
          setAppliedDiscount(null);
      } else {
          setAppliedDiscount(code);
          setPromoInput('');
          setPromoError('');
      }
  };

  const getOrderMessage = () => {
    let message = 'مرحباً، أرغب في طلب المنتجات التالية:\n\n';
    cartItems.forEach(item => {
      const price = item.product.salePrice || item.product.price;
      message += `* ${item.product.name}\n`;
      message += `  (الكمية: ${item.quantity}) - السعر: ${price * item.quantity} ريال\n\n`;
    });
    
    message += `المجموع الفرعي: ${subtotal} ريال\n`;
    if (appliedDiscount) {
        message += `كود الخصم: ${appliedDiscount.code} (-${discountAmount} ريال)\n`;
    }
    message += `*الإجمالي النهائي: ${finalTotal} ريال*`;
    return message;
  };

  const handleWhatsAppCheckout = () => {
    const message = getOrderMessage();
    const whatsappUrl = `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClearCart();
    setAppliedDiscount(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-end z-[70]" onClick={onClose}>
      <div className="bg-gray-800 shadow-xl w-full max-w-md h-full flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="p-4 flex justify-between items-center border-b border-gray-700 bg-gray-900">
          <div className="flex items-center gap-2">
            <ShoppingCartIcon className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-white">سلة المشتريات</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </header>

        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col justify-center items-center text-gray-400 p-4 text-center">
            <div className="bg-gray-900 p-8 rounded-full mb-6">
                <ShoppingCartIcon className="w-16 h-16 text-gray-700" />
            </div>
            <p className="text-xl font-semibold mb-2 text-white">سلتك فارغة!</p>
            <p className="text-sm">لم تضف أي منتج إلى سلة التسوق الخاصة بك بعد.</p>
            <button onClick={onClose} className="mt-8 bg-yellow-500 text-gray-900 px-8 py-2 rounded-full font-bold shadow-lg">تصفح المتجر</button>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {cartItems.map(({ product, quantity }) => {
              const price = product.salePrice || product.price;
              const hasSale = product.salePrice && product.salePrice < product.price;
              const isMaxed = quantity >= product.stock;

              return (
              <div key={product.id} className="flex items-start bg-gray-900 rounded-2xl p-4 border border-gray-700/50">
                <img src={product.imageUrl} alt={product.name} className="w-20 h-20 rounded-xl object-cover mr-4 bg-gray-800" />
                <div className="flex-grow">
                  <h4 className="font-bold text-white mb-1 line-clamp-1">{product.name}</h4>
                  <div className="flex items-baseline space-x-2 rtl:space-x-reverse text-sm mb-3">
                    {hasSale ? (
                        <>
                          <p className="text-yellow-400 font-bold">{product.salePrice} ريال</p>
                          <p className="text-gray-500 line-through text-[10px]">{product.price} ريال</p>
                        </>
                    ) : (
                         <p className="text-yellow-400 font-bold">{product.price} ريال</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <button onClick={() => onUpdateQuantity(product.id, quantity - 1)} className="p-1 rounded-lg bg-gray-700 hover:bg-red-500/20 hover:text-red-400 transition-all"><MinusIcon className="w-4 h-4" /></button>
                    <span className="px-4 font-black text-white">{quantity}</span>
                    <button 
                        onClick={() => onUpdateQuantity(product.id, Math.min(product.stock, quantity + 1))} 
                        disabled={isMaxed}
                        className={`p-1 rounded-lg transition-all ${isMaxed ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-700 hover:bg-yellow-500 hover:text-gray-900'}`}
                    >
                        <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right flex flex-col justify-between items-end h-20">
                  <p className="font-black text-white">{price * quantity} ريال</p>
                   <button onClick={() => onUpdateQuantity(product.id, 0)} className="p-2 text-gray-500 hover:text-red-500 transition-colors" aria-label={`حذف ${product.name}`}>
                      <TrashIcon className="w-5 h-5" />
                   </button>
                </div>
              </div>
            )})}
          </div>
        )}

        {cartItems.length > 0 && (
          <footer className="p-6 border-t border-gray-700 bg-gray-900/80 backdrop-blur-lg">
            {/* Promo Code Input */}
            {!appliedDiscount ? (
                <div className="mb-6">
                    <div className="flex gap-2">
                        <div className="relative flex-grow">
                             <input 
                                type="text" 
                                value={promoInput} 
                                onChange={e => setPromoInput(e.target.value)}
                                placeholder="هل لديك كود خصم؟"
                                className={`w-full bg-gray-800 border-2 ${promoError ? 'border-red-500' : 'border-gray-700'} rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-yellow-500 uppercase`}
                            />
                            <TagIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        </div>
                        <button 
                            onClick={handleApplyPromo}
                            disabled={!promoInput}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                        >
                            تطبيق
                        </button>
                    </div>
                    {promoError && <p className="text-red-500 text-[10px] mt-1 mr-2">{promoError}</p>}
                </div>
            ) : (
                <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-yellow-500" />
                        <div>
                            <p className="text-xs text-gray-400">تم تطبيق الخصم</p>
                            <p className="text-sm font-bold text-white">{appliedDiscount.code}</p>
                        </div>
                    </div>
                    <button onClick={() => setAppliedDiscount(null)} className="text-[10px] text-red-400 hover:underline">إلغاء الخصم</button>
                </div>
            )}

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm text-gray-400">
                <span>المجموع الفرعي</span>
                <span>{subtotal} ريال</span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between text-sm text-green-400">
                  <span>الخصم ({appliedDiscount.code})</span>
                  <span>-{discountAmount.toFixed(0)} ريال</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                <span className="text-lg font-bold text-white">الإجمالي</span>
                <span className="text-3xl font-black text-yellow-400">{finalTotal.toFixed(0)} ريال</span>
              </div>
            </div>
            
            <button
                onClick={handleWhatsAppCheckout}
                className="w-full flex justify-center items-center space-x-2 rtl:space-x-reverse bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-green-500/20 active:scale-95"
            >
                <WhatsAppIcon className="w-6 h-6" />
                <span className="text-lg">إتمام الطلب عبر واتساب</span>
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
