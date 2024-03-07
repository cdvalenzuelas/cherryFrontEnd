// Lib
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Types and Componets
import type { Invoice } from '@state'

const supabase = createClientComponentClient()

export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    // Hacer la query
    const { data, error } = await supabase.from('invoices').select('*')

    // si no viene data o hay un error, lanzar error
    if (data === null || data.length === 0) {
      throw new Error()
    } else if (error !== null) {
      throw new Error()
    }

    return data as Invoice[]
  } catch {
    return []
  }
}
