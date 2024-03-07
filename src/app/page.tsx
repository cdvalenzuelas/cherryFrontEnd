'use client'

// Libs
import { useEffect } from 'react'

// Components | State | types
import { Header } from '@/ui/Global/Header'
import { useProductsState, useInvoicesState, useSalaryState, useUsersStage } from '@state'
import { Sales } from '@/ui/Pages/User/Sales'
import { Reports } from '@/ui/Pages/User/Reports'
import { getProducts, getInvoices, getSalary } from '@/api'

export default function User() {
  const setProducts = useProductsState((state) => state.setProducts)
  const setInvoices = useInvoicesState((state) => state.setInvoices)
  const setSalaries = useSalaryState((state) => state.setSalaries)
  const userStage = useUsersStage(state => state.userStage)

  useEffect(() => {
    (async () => {
      const products = await getProducts()
      const invoices = await getInvoices()
      const salaries = await getSalary()

      setProducts(products)
      setInvoices(invoices)
      setSalaries(salaries)
    })()
  }, [])

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 overflow-auto flex justify-start">
        <main className="flex-1 overflow-auto bg-slate-100">
          {userStage === 'sales' && <Sales />}
          {userStage === 'reports' && <Reports />}
        </main>
      </div>
    </div>
  )
}
