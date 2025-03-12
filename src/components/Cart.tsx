import React from 'react';
import { ShoppingCart, X, Minus, Plus } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: number, change: number) => void;
  onRemoveItem: (productId: number) => void;
  onSubmitOrder: () => void;
}

export const Cart: React.FC<CartProps> = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem,
  onSubmitOrder 
}) => {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ShoppingCart />
          Giỏ hàng
        </h3>
        <span className="text-sm text-gray-600">{items.length} sản phẩm</span>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center gap-4 py-2 border-b">
            <img 
              src={item.product.image} 
              alt={item.product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h4 className="font-medium">{item.product.name}</h4>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, -1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Tổng cộng:</span>
          <span className="text-xl font-bold text-indigo-600">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
          </span>
        </div>
        <button
          onClick={onSubmitOrder}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Đặt hàng
        </button>
      </div>
    </div>
  );
};