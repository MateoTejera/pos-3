
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Panel', icon: 'fa-chart-line' },
    { id: 'pos', label: 'Punto de Venta', icon: 'fa-cash-register' },
    { id: 'inventory', label: 'Inventario', icon: 'fa-boxes-stacked' },
    { id: 'reports', label: 'Reportes', icon: 'fa-file-invoice-dollar' },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col z-50">
      <div className="p-6">
        <div className="flex items-center gap-3 text-indigo-600">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <i className="fas fa-bolt text-xl"></i>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">NovaPOS</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as View)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === item.id
                ? 'bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-100'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <i className={`fas ${item.icon} w-5 text-center text-lg`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 space-y-2 mt-auto">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all duration-200 font-bold"
        >
          <i className="fas fa-sign-out-alt w-5 text-center"></i>
          <span>Cerrar Sesión</span>
        </button>
        
        <div className="bg-slate-900 rounded-2xl p-4 text-white">
          <p className="text-xs text-slate-400 font-medium mb-1">PRO PLAN</p>
          <p className="text-sm font-semibold mb-3">Soporte Prioritario</p>
          <button className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-xs font-bold transition-colors">
            Contactar Soporte
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
