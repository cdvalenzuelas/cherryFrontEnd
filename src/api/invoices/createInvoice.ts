/* eslint-disable @typescript-eslint/no-unused-vars */
// Libs
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Componets
import type { Invoice, Product } from '@state'

const supabase = createClientComponentClient()

interface Response {
  invoice: Invoice | null
  products: Product[]
}

export const createInvoice = async (invoice: Invoice, products: Product[]): Promise<Response> => {
  const { id, total, total_selling, ...rest } = invoice
  const newProducts = products.map(({ id, created_at, ...rest }) => rest )

  try {
    // Voy a insertar el plan
    const { data, error } = await supabase
      .from('invoices')
      .insert({
        total: products.reduce((a, b) => a + b.purchase_price * b.quantity, 0),
        total_selling: products.reduce((a, b) => a + b.selling_price + b.quantity, 0),
        ...rest
      })
      .select()

       // Si hay un error lanzar error
    if (data?.length === 0 || data === null) {
      throw new Error()
    } else if (error !== null) {
      throw new Error()
    }

    const { data: data2, error: error2 } = await supabase
      .from('products')
      .insert(newProducts)
      .select()

       // Si hay un error lanzar error
    if (data2?.length === 0 || data2 === null) {
      throw new Error()
    } else if (error2 !== null) {
      throw new Error()
    }

    return {
      invoice: data[0] as Invoice,
      products: data2 as Product[]
    }
  } catch {
    return {
      invoice: null,
      products: []
    }
  }
}