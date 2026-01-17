import React from 'react';
import { Product } from '../types';
import { XMarkIcon, ShoppingCartIcon, PlusIcon, MinusIcon } from './Icons';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  cart: Map<string, number>;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onViewProduct: (product: Product) => void;
  recommendations: Product[];
  isLoadingRecs: boolean;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  onClose, 
  cart, 
  onUpdateQuantity,
  onViewProduct,
  recommendations,
  isLoadingRecs,
}) => {
  const quantity = cart.get(product.id) || 0;
  const isInCart = quantity > 0;
  const hasSale = product.salePrice && product.salePrice < product.price;

  const handleAddToCart = () => {
    onUpdateQuantity(product.id, 1);
  };

  const categoryMap = {
      'athlete': 'منتجات رياضيين',
      'slimming': 'منتجات تنحيف'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 flex justify-between items-center border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-white truncate">{product.name}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </header>

        <main className="flex-grow overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-auto max-h-[400px] object-contain rounded-lg bg-gray-900/50"
              />
            </div>
            <div className="flex flex-col">
              <span className="bg-yellow-500/10 text-yellow-300 text-sm font-medium px-3 py-1 rounded-full self-start mb-3">{categoryMap[product.category]}</span>
              <h1 className="text-3xl font-extrabold text-white mb-4">{product.name}</h1>
              <p className="text-gray-300 mb-6 flex-grow">{product.description}</p>
              
              <div className="bg-gray-900/50 rounded-lg p-4 mt-auto">
                <div className="flex justify-between items-center">
                  <div className="flex items-baseline space-x-2 rtl:space-x-reverse">
                    {hasSale ? (
                      <>
                        <span className="text-3xl font-extrabold text-yellow-400">{product.salePrice} <span className="text-lg font-normal">ريال</span></span>
                        <span className="text-xl font-normal text-gray-500 line-through">{product.price}</span>
                      </>
                    ) : (
                      <span className="text-3xl font-extrabold text-yellow-400">{product.price} <span className="text-lg font-normal">ريال</span></span>
                    )}
                  </div>
                  
                  {!isInCart ? (
                    <button
                      onClick={handleAddToCart}
                      className="flex items-center space-x-2 rtl:space-x-reverse bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-6 rounded-lg shadow transition-colors duration-300 text-lg"
                    >
                      <ShoppingCartIcon className="w-6 h-6" />
                      <span>أضف للسلة</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-3 rtl:space-x-reverse bg-gray-700 rounded-lg p-1">
                      <button 
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        className="p-2 text-white hover:bg-yellow-500 hover:text-gray-900 rounded-lg transition-colors"
                        aria-label={`زيادة كمية ${product.name}`}
                      >
                        <PlusIcon className="w-6 h-6" />
                      </button>
                      <span className="px-2 text-xl font-bold text-white">{quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        className="p-2 text-white hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                        aria-label={`تقليل كمية ${product.name}`}
                      >
                        <MinusIcon className="w-6 h-6" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Recommendations */}
          <div className="mt-12 border-t border-gray-700 pt-8">
            <h3 className="text-2xl font-bold text-white mb-4">قد يعجبك أيضاً</h3>
            {isLoadingRecs ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-700 rounded-lg h-24"></div>
                ))}
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendations.map(rec => (
                  <button 
                    key={rec.id} 
                    onClick={() => onViewProduct(rec)}
                    className="bg-gray-900 hover:bg-gray-700/50 p-3 rounded-lg flex items-center space-x-4 rtl:space-x-reverse transition-colors text-right w-full"
                  >
                    <img src={rec.imageUrl} alt={rec.name} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
                    <div className="flex-grow">
                      <h4 className="font-semibold text-white">{rec.name}</h4>
                      <p className="text-sm text-yellow-400">{rec.salePrice || rec.price} ريال</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
                <p className="text-gray-400">لا توجد توصيات متاحة حالياً.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductDetailModal;
