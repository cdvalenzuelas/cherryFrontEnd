import { type StateCreator, create } from 'zustand'
import { devtools } from 'zustand/middleware'

// *********************TYPES***************//

export interface Payment {
  id?: string
  created_at?: Date
  teacher: string
  date: Date
  amount: number
  description: string
  image: string
}

export interface PaymentsState {
  payments: Payment[]
}

interface Actions {
  setPayments: (payments: Payment[]) => void
  addPaymnet: (payment: Payment) => void
}

// *********************STATE***************//

const UserStateApi: StateCreator<PaymentsState & Actions> = (set, get) => ({
  payments: [],
  setPayments: (payments) => {
    set({ payments })
  },
  addPaymnet: (payment) => {
    set({
      payments: [...get().payments, payment]
    })
  }
})

export const usePaymentsState = create<PaymentsState & Actions>()(
  devtools(UserStateApi)
)
