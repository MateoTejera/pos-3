
import React from 'react';
import { Sale } from '../types';

interface ReportsProps {
  sales: Sale[];
}

const Reports: React.FC<ReportsProps> = ({ sales }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800">Historial de Ventas</h3>
        <p className="text-sm text-slate-500">Listado detallado de todas las transacciones realizadas.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">ID Venta</th>
              <th className="px-6 py-4">Fecha y Hora</th>
              <th className="px-6 py-4">Artículos</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Ganancia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[...sales].reverse().map((sale) => (
              <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono text-xs text-slate-400 font-bold">#{sale.id.split('-')[0]}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-700">
                    {new Date(sale.timestamp).toLocaleDateString('es-ES')}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {new Date(sale.timestamp).toLocaleTimeString('es-ES')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-slate-600">
                    {sale.items.length} articulos
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                    {sale.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(sale.totalSales)}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-black">
                    +{formatCurrency(sale.totalProfit)}
                  </span>
                </td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  <i className="fas fa-receipt text-4xl mb-4 opacity-20"></i>
                  <p>Aún no se han registrado ventas.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
