
import React, { useState, useEffect } from 'react';
import { View, Product, Sale } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import Login from './components/Login';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('novapos_auth') === 'true';
  });
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('novapos_products');
    return saved ? JSON.parse(saved) : [];
  });
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('novapos_sales');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('novapos_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('novapos_sales', JSON.stringify(sales));
  }, [sales]);

  const handleLogout = () => {
    localStorage.removeItem('novapos_auth');
    setIsAuthenticated(false);
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: crypto.randomUUID() };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const recordSale = (newSale: Sale) => {
    setSales(prev => [...prev, newSale]);
    setProducts(prev => prev.map(p => {
      const item = newSale.items.find(i => i.productId === p.id);
      return item ? { ...p, stock: p.stock - item.quantity } : p;
    }));
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} onLogout={handleLogout} />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-8 transition-all duration-300">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {currentView === 'dashboard' && 'Panel de Control'}
              {currentView === 'pos' && 'Caja Registradora'}
              {currentView === 'inventory' && 'Inventario de Productos'}
              {currentView === 'reports' && 'Análisis de Ventas'}
            </h1>
            <p className="text-slate-500 text-sm">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-white shadow-sm border border-slate-200 rounded-full px-4 py-1.5 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">Sistema Online</span>
             </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {currentView === 'dashboard' && <Dashboard products={products} sales={sales} />}
          {currentView === 'pos' && <POS products={products} onSaleComplete={recordSale} />}
          {currentView === 'inventory' && (
            <Inventory 
              products={products} 
              onAdd={addProduct} 
              onUpdate={updateProduct} 
              onDelete={deleteProduct} 
            />
          )}
          {currentView === 'reports' && <Reports sales={sales} />}
        </div>
      </main>
    </div>
  );
};

export default App;
