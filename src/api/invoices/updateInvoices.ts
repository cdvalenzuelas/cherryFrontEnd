// Libs
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Invoice } from '@state'

const supabase = createClientComponentClient()

interface InvoicesToUpdate {
  name: string
  total: number
}

// Crea la clase en la base de datos
export const updateInvoices = async (invoicesToUpdate: InvoicesToUpdate[]): Promise<Invoice[]> => {
  try {
    const promesas = invoicesToUpdate.map((item) =>
      supabase
        .from('invoices')
        .update({ recovered_money: item.total })
        .eq('name', item.name)
        .select()
    )

    const resultados = await Promise.all(promesas)
    const resultados2 = resultados.map(item => {
      const data = item.data as Invoice[]
      return data[0]
    })
    return resultados2
  } catch {
    return []
  }
}
