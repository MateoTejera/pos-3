
import { GoogleGenAI } from "@google/genai";
import { Product, Sale, BusinessSummary } from "../types";

export const getGeminiBusinessAdvice = async (
  stats: BusinessSummary,
  products: Product[],
  sales: Sale[]
): Promise<string> => {
  // En Vite se usa import.meta.env en lugar de process.env
  const apiKey = import.meta.env.VITE_API_KEY || process.env.API_KEY;
  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const prompt = `
    Actúa como un consultor de negocios experto. Analiza los siguientes datos de mi Punto de Venta (NovaPOS) y dame 3 consejos estratégicos para crecer.
    
    MÉTRICAS:
    - Ventas Totales: $${stats.totalRevenue}
    - Costos de Venta: $${stats.totalCost}
    - Ganancia Neta: $${stats.totalProfit}
    - Margen: ${stats.profitMargin}%
    
    PRODUCTOS: ${products.length} productos registrados.
    VENTAS: ${sales.length} transacciones realizadas.
    
    INSTRUCCIONES:
    1. Mantén los consejos breves, accionables y profesionales.
    2. Responde en español.
    3. No uses formato Markdown complejo, solo texto plano con viñetas.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No pude generar consejos en este momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error al conectar con la IA de consultoría. Verifica tu API Key.";
  }
};
