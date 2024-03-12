/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, type MouseEvent, type ChangeEvent, type Dispatch, type SetStateAction } from 'react'

import { createProductSale, updateInvoices, updateProducts, createSalary } from '@/api'
import { type Invoice, useInvoicesState, useProductsState, useSalaryState, type Salary } from '@/state'

interface Summary {
  product_id: string
  invoice: string
  quantity: number
  quantityFromDb: number
  price: number
  total: number
  profit: number
  discount?: number
}

interface InvoicesToUpdate {
  name: string
  total: number
}

interface ProductsToUpdate {
  id: string
  quantity: number
}

export const useNewSaleModal = (setIsOpen: Dispatch<SetStateAction<boolean>>) => {
  const invoices = useInvoicesState((state) => state.invoices)
  const salaries = useSalaryState((state) => state.salaries)
  const addSalary = useSalaryState((state) => state.addSalary)
  const updateTotalRecovery = useInvoicesState(state => state.updateTotalRecovery)
  const updateProductsQuantity = useProductsState(state => state.updateProductsQuantity)

  const [summary, setSummary] = useState<Summary[]>([])
  const [date, setDate] = useState<string>(() => {
    const newDate = new Date()
    const month = newDate.getMonth() + 1 < 10 ? `0${newDate.getMonth() + 1}` : `${newDate.getMonth() + 1}`
    const day = newDate.getDate() < 10 ? `0${newDate.getDate()}` : `${newDate.getDate()}`

    return `${newDate.getFullYear()}-${month}-${day}`
  })

  const getSummary = (summary: Summary[]) => {
    setSummary(summary)
  }

  // Manejar el agregar y eliminar usuarios
  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const productsToUpdate: ProductsToUpdate[] = summary.map(item => {
      return {
        id: item.product_id,
        quantity: item.quantityFromDb - item.quantity
      }
    })

    const invoicesToUpdate: InvoicesToUpdate[] = []

    summary.forEach(element => {
      const internalInvoicesToUpdate = invoicesToUpdate.map(item => item.name)
      const invoice = invoices.find(item => item.name === element.invoice) as Invoice

      if (internalInvoicesToUpdate.includes(element.invoice)) {
        const index = internalInvoicesToUpdate.indexOf(element.invoice)
        invoicesToUpdate[index].total += element.total
      } else {
        invoicesToUpdate.push({
          name: element.invoice,
          total: invoice.recovered_money + element.total
        })
      }
    })

    const salaryIsOk = salaries.some(item => {
      console.log('-----------------')
      console.log(String(item.date), date)
      console.log(String(item.date) === date)

      return String(item.date) === date
    })

    if (!salaryIsOk) {
      const [year, month, day] = date.split('-')

      const newSalary: Salary = {
        date,
        amount: 50000,
        year: Number(year),
        month: Number(month)
      }

      const [createdSalary] = await createSalary(newSalary)
      addSalary(createdSalary)
    }

    const productSale = await createProductSale(summary, date)
    const updatedInvoices = await updateInvoices(invoicesToUpdate)
    const updatedProducts = await updateProducts(productsToUpdate)

    updateTotalRecovery(invoicesToUpdate)
    updateProductsQuantity(productsToUpdate)
    setIsOpen(false)
  }

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDate(value)
  }

  return {
    handleDateChange,
    handleSubmit,
    getSummary,
    date,
    total: summary.reduce((a, b) => a + b.total, 0),
    quantity: summary.reduce((a, b) => a + b.quantity, 0)
  }
}
