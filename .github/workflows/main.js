```react
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Settings, Phone, Plus, Trash2, X, CheckCircle, Mail, Menu, ShoppingCart } from 'lucide-react';

// Initial Dummy Products
const initialProducts = [
  {
    id: 1,
    name: "Classic Black Custom T-Shirt",
    price: 499,
    description: "Premium 100% cotton classic black t-shirt. Perfect for your custom designs and logos.",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "White Graphic Canvas Tee",
    price: 399,
    description: "Breathable white fabric, ideal for vibrant prints and everyday wear.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Urban Gray Streetwear Shirt",
    price: 599,
    description: "Oversized fit streetwear style t-shirt in urban gray. High durability.",
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=600&q=80"
  }
];

export default function App() {
  // App State
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [viewMode, setViewMode] = useState('shop'); // 'shop', 'admin'
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Admin Settings State
  const [adminEmail, setAdminEmail] = useState("orders@xpartzone.com");
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image: '' });

  // Checkout State
  const [checkoutData, setCheckoutData] = useState({ name: '', phone: '', address: '' });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');

  // Phone constant from user request
  const storePhone = "+91 98647 15728";

  // --- Handlers ---
  const handleAddToCart = (product, size) => {
    setCart([...cart, { ...product, size, cartId: Date.now() }]);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const getTotal = () => cart.reduce((sum, item) => sum + Number(item.price), 0);

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    
    // Generate Order Receipt Text
    const receiptText = `
NEW ORDER - X-PART ZONE
-------------------------
Customer Name: ${checkoutData.name}
Phone Number: ${checkoutData.phone}
Delivery Address: ${checkoutData.address}

ORDER DETAILS:
${cart.map((item, index) => `${index + 1}. ${item.name} (Size: ${item.size}) - ₹${item.price}`).join('\n')}

TOTAL AMOUNT TO PAY: ₹${getTotal()}
-------------------------
Please process this order.
    `.trim();

    // Trigger Email Client via mailto
    const mailtoLink = `mailto:${adminEmail}?subject=New Order from ${checkoutData.name} - X-PART ZONE&body=${encodeURIComponent(receiptText)}`;
    window.location.href = mailtoLink;

    // Show success and clear cart
    setOrderSuccess(true);
    setCart([]);
    setCheckoutData({ name: '', phone: '', address: '' });
    setTimeout(() => {
      setOrderSuccess(false);
      setIsCartOpen(false);
    }, 3000);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    
    const productToAdd = {
      ...newProduct,
      id: Date.now(),
      image: newProduct.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"
    };
    
    setProducts([productToAdd, ...products]);
    setNewProduct({ name: '', price: '', description: '', image: '' });
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // --- Components ---

  const Header = () => (
    <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setViewMode('shop')}>
            <div className="bg-red-600 p-2 rounded-lg font-bold text-xl tracking-wider">X-PART</div>
            <span className="font-semibold text-xl tracking-wide hidden sm:block">ZONE</span>
          </div>
          
          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="hidden sm:flex items-center text-sm text-gray-300">
              <Phone size={16} className="mr-2" />
              {storePhone}
            </div>
            
            <button 
              onClick={() => setViewMode('admin')}
              className={`flex items-center space-x-1 p-2 rounded-md transition-colors ${viewMode === 'admin' ? 'bg-slate-700 text-white' : 'text-gray-400 hover:text-white hover:bg-slate-800'}`}
              title="Admin Panel"
            >
              <Settings size={20} />
              <span className="hidden md:block text-sm">Customize</span>
            </button>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md transition-colors relative"
            >
              <ShoppingBag size={20} />
              <span className="hidden sm:block text-sm font-medium">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  const ShopView = () => (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="bg-slate-800 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Premium Custom T-Shirts</h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Customize your style with X-PART ZONE. High-quality fabric, tailored for you. Order today and get direct updates.</p>
          <a href="#products" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 shadow-lg">
            Shop Collection
          </a>
        </div>
      </div>

      {/* Products Grid */}
      <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-red-600 pl-3">Our Products</h2>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <ShoppingBag size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg">No products available right now.</p>
            <button onClick={() => setViewMode('admin')} className="mt-4 text-red-600 font-medium hover:underline">Add products in Admin panel</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="h-64 overflow-hidden relative bg-gray-100">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-colors duration-300" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">{product.description}</p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-xl font-bold text-slate-900">₹{product.price}</span>
                    <button 
                      onClick={() => { setSelectedProduct(product); setSelectedSize('M'); }}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const AdminView = () => (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Website Customization Settings</h2>
        <p className="text-gray-600">Add products, edit details, and configure your order receipt settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Forms Section */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Email Setting */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Mail className="mr-2 text-red-600" size={20} />
              Order Email Settings
            </h3>
            <p className="text-sm text-gray-500 mb-4">Orders will be drafted and sent to this email automatically.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email Address</label>
                <input 
                  type="email" 
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., owner@xpartzone.com"
                />
              </div>
            </div>
          </div>

          {/* Add Product Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Plus className="mr-2 text-red-600" size={20} />
              Add New Product
            </h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input 
                  required
                  type="text" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., Cool Custom T-Shirt"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                <input 
                  required
                  type="number" 
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="499"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows="3"
                  placeholder="Details about the t-shirt..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input 
                  type="url" 
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center"
              >
                <Plus size={18} className="mr-2"/> Add Product
              </button>
            </form>
          </div>
        </div>

        {/* Product List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-4">Manage Current Products ({products.length})</h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {products.length === 0 ? (
                <p className="text-gray-500 italic text-center py-8">No products found. Add some from the form.</p>
              ) : (
                products.map(product => (
                  <div key={product.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg bg-gray-200" />
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="font-bold text-gray-900">{product.name}</h4>
                      <p className="text-slate-600 font-medium">₹{product.price}</p>
                      <p className="text-gray-500 text-sm truncate max-w-xs hidden sm:block">{product.description}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-red-200">
      <Header />

      <main>
        {viewMode === 'shop' ? <ShopView /> : <AdminView />}
      </main>

      {/* Footer */}
      {viewMode === 'shop' && (
        <footer className="bg-slate-900 text-slate-400 py-12 mt-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold text-white tracking-widest mb-4">X-PART ZONE</h3>
            <p className="mb-2">Your premier destination for custom T-Shirts.</p>
            <div className="flex items-center justify-center space-x-2 text-slate-300">
              <Phone size={18} />
              <span>Call us: {storePhone}</span>
            </div>
            <p className="mt-8 text-sm opacity-60">© {new Date().getFullYear()} X-PART ZONE. All rights reserved.</p>
          </div>
        </footer>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-gray-100 z-10 text-gray-700 shadow-sm transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="md:w-1/2 bg-gray-100">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover min-h-[300px]" />
            </div>
            
            <div className="md:w-1/2 p-8 flex flex-col">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h2>
              <p className="text-3xl font-bold text-red-600 mb-6">₹{selectedProduct.price}</p>
              
              <div className="mb-6 border-t border-b py-4">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Product Details</h4>
                <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Select Size</h4>
                <div className="flex space-x-3">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg font-bold flex items-center justify-center transition-all ${selectedSize === size ? 'bg-slate-900 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => handleAddToCart(selectedProduct, selectedSize)}
                className="mt-auto w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl text-lg transition-transform transform hover:scale-[1.02] shadow-lg flex items-center justify-center"
              >
                <ShoppingBag className="mr-2" />
                Add to Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart & Checkout Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold flex items-center">
                <ShoppingCart className="mr-2 text-slate-800" />
                Your Order
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600">
                <X size={20} />
              </button>
            </div>

            {orderSuccess ? (
              <div className="f 
