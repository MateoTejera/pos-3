
import React, { useMemo, useState } from 'react';
import { Product, Sale } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import GeminiInsights from './GeminiInsights';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, sales }) => {
  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalSales, 0);
    const totalCost = sales.reduce((acc, sale) => acc + sale.totalCost, 0);
    const totalProfit = totalRevenue - totalCost;
    const margin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    return {
      revenue: totalRevenue,
      cost: totalCost,
      profit: totalProfit,
      margin: margin.toFixed(1),
      count: sales.length,
      inventoryValue: products.reduce((acc, p) => acc + (p.cost * p.stock), 0)
    };
  }, [products, sales]);

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const daySales = sales.filter(s => new Date(s.timestamp).toISOString().split('T')[0] === date);
      return {
        date: new Date(date).toLocaleDateString('es-ES', { weekday: 'short' }),
        ventas: daySales.reduce((acc, s) => acc + s.totalSales, 0),
        ganancia: daySales.reduce((acc, s) => acc + s.totalProfit, 0)
      };
    });
  }, [sales]);

  const topProducts = useMemo(() => {
    const counts: Record<string, { name: string, qty: number }> = {};
    sales.forEach(s => {
      s.items.forEach(i => {
        if (!counts[i.productId]) counts[i.productId] = { name: i.name, qty: 0 };
        counts[i.productId].qty += i.quantity;
      });
    });
    return Object.values(counts)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [sales]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Ventas Totales" value={formatCurrency(stats.revenue)} icon="fa-sack-dollar" color="indigo" />
        <StatCard title="Ganancia Neta" value={formatCurrency(stats.profit)} icon="fa-chart-line" color="emerald" trend={`${stats.margin}% margen`} />
        <StatCard title="Costos de Venta" value={formatCurrency(stats.cost)} icon="fa-hand-holding-dollar" color="amber" />
        <StatCard title="Valor Inventario" value={formatCurrency(stats.inventoryValue)} icon="fa-boxes-packing" color="slate" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Crecimiento del Proyecto (Últimos 7 días)</h3>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Ventas</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Ganancia</span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value) => formatCurrency(value as number)}
                />
                <Area type="monotone" dataKey="ventas" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVentas)" />
                <Area type="monotone" dataKey="ganancia" stroke="#10b981" strokeWidth={3} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights and Top Products */}
        <div className="space-y-6">
          <GeminiInsights sales={sales} products={products} stats={stats} />
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Top 5 Productos</h3>
            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((p, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                        {i + 1}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{p.name}</span>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{p.qty} vendidos</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-4 italic">No hay datos de ventas aún.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: 'indigo' | 'emerald' | 'amber' | 'slate';
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend }) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    slate: 'bg-slate-100 text-slate-600'
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
          <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
          {trend && <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1"><i className="fas fa-arrow-trend-up"></i> {trend}</p>}
        </div>
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <i className={`fas ${icon} text-xl`}></i>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
