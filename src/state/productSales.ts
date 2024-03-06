import { type StateCreator, create } from "zustand";
import { devtools } from "zustand/middleware";

// *********************TYPES***************//

interface ProductSummary {
  product_id: string;
  quantity: number;
  discount: number;
}

export interface ProductSale {
  id: number;
  date: Date;
  profit: number;
  total: number;
  summary: ProductSummary[];
}

export interface ProductSaleState {
  productSales: ProductSale[];
}

interface Actions {
  setProductSales: (productSales: ProductSale[]) => void;
}

// *********************STATE***************//

const UserStateApi: StateCreator<ProductSaleState & Actions> = (set, get) => ({
  productSales: [],
  setProductSales: (productSales) => {
    set({ productSales });
  },
});

export const useProductSalesState = create<ProductSaleState & Actions>()(
  devtools(UserStateApi),
);
