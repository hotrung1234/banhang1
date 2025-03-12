import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { products } from './data/products';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { OrderForm, OrderFormData } from './components/OrderForm';
import { Product, CartItem } from './types';
import toast, { Toaster } from 'react-hot-toast';

// Replace this with your actual Google Apps Script URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzLIXS_BWd4fpQ3g_UW63hoOWU0BVB2K3HUS_3w5RrCAHqaM5NjTZM6Q5-XanxrO5GxBQ/exec';

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast.success('Đã thêm vào giỏ hàng');
  };

  const updateQuantity = (productId: number, change: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    toast.success('Đã xóa sản phẩm');
  };

  const handleSubmitOrder = async (formData: OrderFormData) => {
    const orderData = {
      ...formData,
      items: cartItems.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total: item.quantity * item.product.price
      })),
      totalAmount: cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    };

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      setCartItems([]);
      setShowOrderForm(false);
      toast.success('Đặt hàng thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-indigo-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">Cửa hàng truyền thống</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </main>

      <Cart
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onSubmitOrder={() => setShowOrderForm(true)}
      />

      {showOrderForm && (
        <OrderForm
          items={cartItems}
          onClose={() => setShowOrderForm(false)}
          onSubmit={handleSubmitOrder}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
}

export default App;