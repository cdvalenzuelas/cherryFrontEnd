import { type StateCreator, create } from 'zustand'
import { devtools } from 'zustand/middleware'

// *********************TYPES***************//
export type PaymentMode = 'chash' | 'nequi' | 'daviplata' | 'tranfer' | 'tranfiya'

export interface Sale {
  id?: string
  user_id: string
  pack_id: string
  sale_date: Date
  start_date: Date
  end_date: Date
  classes: number
  taken_classes: number
  active: boolean
  discount: number
  discount_description: string
  payment_mode: PaymentMode
  price: number
  total_price: number
  name: string
}
export interface SalesReport {
  year: number
  month: number
  total: number
  profit: number
}

export interface SaleFromDb extends Omit<Sale, 'sale_date' | 'start_date' | 'end_date'> {
  sale_date: string
  start_date: string
  end_date: string
}

export interface SalesState {
  sales: Sale[]
}

interface Actions {
  setSales: (sales: Sale[]) => void
  addSale: (sale: Sale) => void
}

// *********************STATE***************//

const UserStateApi: StateCreator<SalesState & Actions> = (set, get) => ({
  sales: [],
  setSales: (sales) => {
    set({ sales })
  },
  addSale: (sale) => {
    set({ sales: [...get().sales, sale] })
  }
})

export const useSalesState = create<SalesState & Actions>()(
  devtools(UserStateApi)
)
