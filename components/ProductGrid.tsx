
import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../types';
import ProductCard from './ProductCard';
import { MagnifyingGlassIcon, PlusIcon } from './Icons';

interface ProductGridProps {
  products: Product[];
  isAdmin: boolean;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onAddToCart: (productId: string) => void;
  onAddNew: () => void;
  cart: Map<string, number>;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  isDevMode: boolean;
  onView: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, isAdmin, onEdit, onDelete, onAddToCart, onAddNew, cart, onUpdateQuantity, isDevMode, onView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);

  const categoryOptions: { value: ProductCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'كل المنتجات' },
    { value: 'athlete', label: 'منتجات رياضيين' },
    { value: 'slimming', label: 'منتجات تنحيف' },
  ];

  return (
    <section id="products" className="py-12 md:py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center md:text-right">منتجاتنا</h2>
            {isDevMode && isAdmin && (
                <button
                    onClick={onAddNew}
                    className="flex items-center space-x-2 rtl:space-x-reverse bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-300"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>إضافة منتج جديد</span>
                </button>
            )}
        </div>
        
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
                <input
                    type="text"
                    placeholder="ابحث عن منتج..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800 border-2 border-gray-700 text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                </div>
            </div>
            <div>
                 <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as ProductCategory | 'all')}
                    className="w-full bg-gray-800 border-2 border-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 cursor-pointer"
                >
                   {categoryOptions.map(option => (
                     <option key={option.value} value={option.value}>{option.label}</option>
                   ))}
                </select>
            </div>
        </div>

        {filteredProducts.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isAdmin={isAdmin}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onAddToCart={onAddToCart}
                  quantity={cart.get(product.id) || 0}
                  onUpdateQuantity={onUpdateQuantity}
                  isDevMode={isDevMode}
                  onView={onView}
                />
              ))}
            </div>
        ) : (
            <div className="text-center py-16 bg-gray-800/50 rounded-3xl border border-dashed border-gray-700">
                <p className="text-xl text-gray-400">لا توجد منتجات تطابق هذا البحث.</p>
            </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
