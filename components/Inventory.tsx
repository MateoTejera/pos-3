
import React, { useState } from 'react';
import { Product } from '../types';

interface InventoryProps {
  products: Product[];
  onAdd: (product: Omit<Product, 'id'>) => void;
  onUpdate: (product: Product) => void;
  onDelete: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, onAdd, onUpdate, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    cost: 0,
    price: 0,
    stock: 0,
    category: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdate({ ...formData, id: editingProduct.id });
    } else {
      onAdd(formData);
    }
    closeModal();
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        cost: product.cost,
        price: product.price,
        stock: product.stock,
        category: product.category || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', cost: 0, price: 0, stock: 0, category: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Catálogo de Productos</h3>
          <p className="text-sm text-slate-500">Gestiona tus productos, costos y precios de venta.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
        >
          <i className="fas fa-plus"></i>
          Nuevo Producto
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Costo</th>
              <th className="px-6 py-4">Precio Venta</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length > 0 ? products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-700">{product.name}</div>
                  <div className="text-[10px] text-slate-400 uppercase">ID: {product.id.split('-')[0]}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                    {product.category || 'General'}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">{formatCurrency(product.cost)}</td>
                <td className="px-6 py-4">
                  <span className="font-bold text-indigo-600">{formatCurrency(product.price)}</span>
                  <div className="text-[10px] text-emerald-600 font-bold">+{(((product.price-product.cost)/product.cost)*100).toFixed(0)}% Utilidad</div>
                </td>
                <td className="px-6 py-4">
                   <div className={`flex items-center gap-2 font-bold ${product.stock < 5 ? 'text-rose-500' : 'text-slate-700'}`}>
                      <span className={`w-2 h-2 rounded-full ${product.stock < 5 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400'}`}></span>
                      {product.stock} un.
                   </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => openModal(product)}
                      className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                      title="Editar"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      onClick={() => { if(confirm('¿Seguro?')) onDelete(product.id) }}
                      className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Eliminar"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  <i className="fas fa-folder-open text-4xl mb-4 opacity-20"></i>
                  <p>No hay productos registrados.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-xl font-bold text-slate-800">{editingProduct ? 'Editar Producto' : 'Añadir Producto'}</h4>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times text-xl"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Nombre del Producto</label>
                <input 
                  required
                  type="text"
                  placeholder="Ej: Camiseta de Algodón"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Costo (Compra)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input 
                      required
                      type="number"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={formData.cost}
                      onChange={e => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Precio de Venta</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input 
                      required
                      type="number"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Stock Inicial</label>
                  <input 
                    required
                    type="number"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Categoría</label>
                  <input 
                    type="text"
                    placeholder="Ej: Ropa"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2">
                   <i className="fas fa-save"></i>
                   {editingProduct ? 'Guardar Cambios' : 'Registrar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
