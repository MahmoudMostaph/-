
import React from 'react';
import { Product } from '../types';
import { PencilIcon, TrashIcon, ShoppingCartIcon, PlusIcon, MinusIcon, EyeIcon } from './Icons';

interface ProductCardProps {
  product: Product;
  isAdmin: boolean;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onAddToCart: (productId: string) => void;
  quantity: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  isDevMode: boolean;
  onView: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isAdmin, onEdit, onDelete, onAddToCart, quantity, onUpdateQuantity, isDevMode, onView }) => {
  const isInCart = quantity > 0;
  const hasSale = product.salePrice && product.salePrice < product.price;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl group border border-gray-700/50 hover:border-yellow-500/30 ${isOutOfStock ? 'opacity-80' : ''}`}>
      <div className="relative overflow-hidden">
        {/* Product Image and Quick View Trigger */}
        <div className="relative h-64 overflow-hidden bg-gray-900 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'grayscale' : ''}`}
          />
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={() => onView(product)}
              className="bg-yellow-500 text-gray-900 px-5 py-2.5 rounded-full font-bold flex items-center space-x-2 rtl:space-x-reverse transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:bg-yellow-400"
            >
              <EyeIcon className="w-5 h-5" />
              <span>تفاصيل المنتج</span>
            </button>
          </div>

          {/* Out of Stock Label */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-600 text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-lg">غير متوفر حالياً</span>
            </div>
          )}

          {/* Sale Badge */}
          {hasSale && !isOutOfStock && (
             <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md z-10 animate-pulse">
                خصم حلم
             </div>
          )}
        </div>

        {isInCart && (
          <span className="absolute top-3 left-3 z-10 bg-yellow-500 text-gray-900 text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center shadow-lg border-2 border-gray-900">
            {quantity}
          </span>
        )}

        {isDevMode && isAdmin && (
          <div className="absolute top-3 right-3 flex space-x-2 rtl:space-x-reverse z-10">
            <button
              onClick={() => onEdit(product)}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md"
              aria-label={`تعديل ${product.name}`}
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow cursor-pointer" onClick={() => onView(product)}>
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-1">{product.name}</h3>
          </div>
          <p className="text-gray-400 text-xs mb-3 line-clamp-2 h-8">{product.description}</p>
          
          {/* Stock Badges */}
          <div className="mb-4 flex flex-wrap gap-2">
             {isLowStock && (
                <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded border border-orange-500/30">
                  متبقي {product.stock} فقط!
                </span>
             )}
             {!isOutOfStock && !isLowStock && (
                <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20">
                  متوفر في المركز
                </span>
             )}
          </div>
        </div>
        
        <div className="mt-auto flex justify-between items-center border-t border-gray-700/50 pt-4">
          <div className="flex flex-col">
            {hasSale ? (
              <>
                <span className="text-xl font-black text-yellow-400 leading-none">{product.salePrice} <span className="text-[10px] font-medium">ريال</span></span>
                <span className="text-[11px] font-medium text-gray-500 line-through mt-1">{product.price} ريال</span>
              </>
            ) : (
              <span className="text-xl font-black text-yellow-400">{product.price} <span className="text-[10px] font-medium">ريال</span></span>
            )}
          </div>
          
          {!isInCart ? (
            <button
              onClick={() => onAddToCart(product.id)}
              disabled={isOutOfStock}
              className={`flex items-center space-x-2 rtl:space-x-reverse font-bold py-2 px-4 rounded transition-all duration-300 ${
                isOutOfStock 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-yellow-500 hover:bg-yellow-600 text-gray-900 shadow-lg shadow-yellow-500/10'
              }`}
            >
              <ShoppingCartIcon className="w-4 h-4" />
              <span className="text-sm">{isOutOfStock ? 'نفد' : 'شراء'}</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 rtl:space-x-reverse bg-gray-900/50 rounded p-1 border border-gray-700">
              <button 
                onClick={() => onUpdateQuantity(product.id, Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                className={`p-1 rounded transition-colors ${
                    quantity >= product.stock 
                    ? 'text-gray-600 cursor-not-allowed' 
                    : 'text-white hover:bg-yellow-500 hover:text-gray-900'
                }`}
              >
                <PlusIcon className="w-4 h-4" />
              </button>
              <span className="px-2 text-sm font-bold text-white">{quantity}</span>
              <button 
                onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                className="p-1 text-white hover:bg-red-500 hover:text-white rounded transition-colors"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
