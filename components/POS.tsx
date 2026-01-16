
import React, { useState, useMemo } from 'react';
import { Product, Sale, SaleItem } from '../types';

interface POSProps {
  products: Product[];
  onSaleComplete: (sale: Sale) => void;
}

const POS: React.FC<POSProps> = ({ products, onSaleComplete }) => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.stock > 0
    );
  }, [products, searchTerm]);

  const addToCart = (p: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === p.id);
      if (existing) {
        if (existing.quantity >= p.stock) return prev;
        return prev.map(item => item.productId === p.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId: p.id, name: p.name, quantity: 1, price: p.price, cost: p.cost }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const product = products.find(p => p.id === productId);
        const newQty = item.quantity + delta;
        if (newQty <= 0) return item;
        if (product && newQty > product.stock) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const totals = useMemo(() => {
    const totalSales = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const totalCost = cart.reduce((acc, i) => acc + (i.cost * i.quantity), 0);
    return { totalSales, totalCost, totalProfit: totalSales - totalCost };
  }, [cart]);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const sale: Sale = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      items: cart,
      ...totals
    };
    onSaleComplete(sale);
    setCart([]);
    alert('¡Venta realizada con éxito!');
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
      {/* Products Selection */}
      <div className="lg:col-span-3 flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
           <div className="relative">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="text"
                placeholder="Buscar producto por nombre..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredProducts.map(p => (
              <button 
                key={p.id}
                onClick={() => addToCart(p)}
                className="group p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:bg-indigo-50 hover:border-indigo-200 transition-all active:scale-95 flex flex-col justify-between h-40"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.category || 'General'}</span>
                    <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <i className="fas fa-plus"></i>
                    </span>
                  </div>
                  <h5 className="font-bold text-slate-700 text-sm line-clamp-2 leading-tight">{p.name}</h5>
                </div>
                <div className="mt-4">
                   <p className="text-lg font-black text-slate-800">{formatCurrency(p.price)}</p>
                   <p className={`text-[10px] font-bold ${p.stock < 10 ? 'text-rose-500' : 'text-slate-400'}`}>
                    Stock: {p.stock} un.
                   </p>
                </div>
              </button>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-20 text-center text-slate-400">
                <i className="fas fa-ghost text-4xl mb-4 opacity-10"></i>
                <p>No se encontraron productos disponibles.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="lg:col-span-2 flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <i className="fas fa-shopping-cart text-indigo-500"></i>
            Carrito de Compra
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.map(item => (
            <div key={item.productId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in slide-in-from-right-4 duration-300">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-700 text-sm truncate">{item.name}</p>
                <p className="text-xs font-medium text-slate-400">{formatCurrency(item.price)} x unidad</p>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-slate-100 shadow-sm">
                 <button onClick={() => updateQuantity(item.productId, -1)} className="w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-50 rounded"><i className="fas fa-minus"></i></button>
                 <span className="w-8 text-center text-xs font-black text-slate-800">{item.quantity}</span>
                 <button onClick={() => updateQuantity(item.productId, 1)} className="w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-50 rounded"><i className="fas fa-plus"></i></button>
              </div>
              <div className="text-right min-w-[80px]">
                <p className="text-sm font-black text-indigo-600">{formatCurrency(item.price * item.quantity)}</p>
                <button onClick={() => removeFromCart(item.productId)} className="text-[10px] text-rose-500 font-bold hover:underline">Eliminar</button>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-4 opacity-50">
              <i className="fas fa-receipt text-6xl"></i>
              <p className="font-bold">Carrito vacío</p>
            </div>
          )}
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
           <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.totalSales)}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-slate-900 border-t border-slate-200 pt-2">
                <span>Total a Cobrar</span>
                <span className="text-indigo-600">{formatCurrency(totals.totalSales)}</span>
              </div>
           </div>
           <button 
             disabled={cart.length === 0}
             onClick={handleCheckout}
             className={`w-full py-4 rounded-2xl font-black text-white shadow-xl flex items-center justify-center gap-3 transition-all ${cart.length > 0 ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 hover:-translate-y-0.5' : 'bg-slate-300 cursor-not-allowed shadow-none'}`}
           >
             <i className="fas fa-check-circle text-xl"></i>
             COMPLETAR VENTA
           </button>
        </div>
      </div>
    </div>
  );
};

export default POS;
