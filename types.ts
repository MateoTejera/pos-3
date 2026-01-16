
export interface Product {
  id: string;
  name: string;
  cost: number;
  price: number;
  stock: number;
  category?: string;
}

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  cost: number;
}

export interface Sale {
  id: string;
  timestamp: number;
  items: SaleItem[];
  totalSales: number;
  totalCost: number;
  totalProfit: number;
}

export interface BusinessSummary {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  totalSalesCount: number;
  profitMargin: number;
}

export type View = 'dashboard' | 'pos' | 'inventory' | 'reports';
