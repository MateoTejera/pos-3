
import React, { useState } from 'react';
import { Product, Sale, BusinessSummary } from '../types';
import { getGeminiBusinessAdvice } from '../services/geminiService';

interface GeminiInsightsProps {
  sales: Sale[];
  products: Product[];
  stats: any;
}

const GeminiInsights: React.FC<GeminiInsightsProps> = ({ sales, products, stats }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    const businessSummary: BusinessSummary = {
      totalRevenue: stats.revenue,
      totalCost: stats.cost,
      totalProfit: stats.profit,
      totalSalesCount: sales.length,
      profitMargin: parseFloat(stats.margin)
    };
    const advice = await getGeminiBusinessAdvice(businessSummary, products, sales);
    setInsight(advice);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-2xl text-white shadow-xl shadow-indigo-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
          <i className="fas fa-sparkles text-amber-300"></i>
        </div>
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider">Nova Assistant AI</h3>
          <p className="text-indigo-100 text-[10px] font-medium opacity-80">Consultoría Estratégica</p>
        </div>
      </div>

      {!insight && !loading && (
        <div className="space-y-4">
          <p className="text-sm text-indigo-100 leading-relaxed">
            Analiza tu rendimiento actual y recibe recomendaciones estratégicas personalizadas para maximizar tus ganancias.
          </p>
          <button 
            onClick={fetchAdvice}
            className="w-full py-2.5 bg-white text-indigo-600 font-bold rounded-xl shadow-lg shadow-black/10 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <i className="fas fa-wand-magic-sparkles"></i>
            Generar Insights
          </button>
        </div>
      )}

      {loading && (
        <div className="py-6 flex flex-col items-center justify-center gap-3">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="text-xs font-medium text-indigo-100">Analizando métricas de negocio...</p>
        </div>
      )}

      {insight && !loading && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-xs leading-relaxed text-indigo-100 whitespace-pre-line">
            {insight}
          </p>
          <button 
            onClick={() => setInsight(null)}
            className="mt-4 text-[10px] uppercase font-black text-indigo-300 hover:text-white tracking-widest"
          >
            <i className="fas fa-rotate-right mr-1"></i> Reiniciar
          </button>
        </div>
      )}
    </div>
  );
};

export default GeminiInsights;
