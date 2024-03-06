// Libs
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Componets
import type { Sale, User, SaleFromDb } from '@state'

const supabase = createClientComponentClient()

export const createSale = async (sale: Sale): Promise<Sale[]> => {
  try {
    // Voy a insertar el plan
    const { data, error } = await supabase
      .from('sales')
      .insert(sale)
      .select()

    const createdSale: SaleFromDb[] | null = [...data as SaleFromDb[]]

    // Si hay un error lanzar error
    if (createdSale.length === 0 || createdSale === null) {
      throw new Error()
    } else if (error !== null) {
      throw new Error()
    }

    // Voy a modificar el usuario para darle un plan y activar el usuario
    const { data: data2, error: error2 } = await supabase
      .from('users') // Reemplaza 'usuarios' con el nombre de tu tabla
      .update({ active_plan: createdSale[0].id })
      .match({ id: sale.user_id })
      .select()

    const userModified: User[] = [...data2 as User[]]

    // Si hay un error lanzar error
    if (userModified.length === 0 || userModified === null) {
      throw new Error()
    } else if (error2 !== null) {
      throw new Error()
    }

    const { sale_date: saleDate, start_date: startDate, end_date: endDate, ...rest } = createdSale[0]

    // Retornar la venta creada
    return [{
      ...rest,
      sale_date: sale.sale_date,
      start_date: sale.start_date,
      end_date: sale.end_date
    }]
  } catch {
    return []
  }
}
