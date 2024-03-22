import { type StateCreator, create } from 'zustand'
import { devtools } from 'zustand/middleware'

// *********************TYPES***************//

export interface Invoice {
  id: number
  name: string
  provider: string
  reference: string
  date: Date
  total: number
  recovered_money: number
  total_selling: number
  owner: 'cristian' | 'cherry'
}

interface InvoicesToUpdate {
  name: string
  total: number
}

export interface InvoicesState {
  invoices: Invoice[]
}

interface Actions {
  setInvoices: (invoices: Invoice[]) => void
  updateTotalRecovery: (invoicesToUpdate: InvoicesToUpdate[]) => void
}

// *********************STATE***************//

const UserStateApi: StateCreator<InvoicesState & Actions> = (set, get) => ({
  invoices: [],
  setInvoices: (invoices) => {
    set({ invoices })
  },
  updateTotalRecovery: (invoicesToUpdate) => {
    invoicesToUpdate.forEach(item => {
      const invoice = get().invoices.find(item2 => item2.name === item.name) as Invoice
      const restOfInvoives = get().invoices.filter(item2 => item2.name !== item.name)

      invoice.recovered_money = item.total
      set({
        invoices: [invoice, ...restOfInvoives]
      })
    })
  }
})

export const useInvoicesState = create<InvoicesState & Actions>()(
  devtools(UserStateApi)
)
