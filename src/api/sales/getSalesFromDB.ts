import type { SaleFromDb } from '@state'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

// Obtener los usuarios
export const getSalesFromDB = async (): Promise<SaleFromDb[]> => {
  try {
    // Hacer la query
    const { data, error } = await supabase
      .from('sales')
      .select('*')

    // Si no viene data o hay un error lanzar error
    if (data === null || data.length === 0) {
      throw new Error()
    } else if (error !== null) {
      throw new Error()
    }

    // Vamos atransformar la data
    const sales: SaleFromDb[] = data as SaleFromDb[]

    return sales
  } catch (error) {
    return []
  }
}
