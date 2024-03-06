import type { UserFromDB, User, SaleFromDb } from '@state'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { populate, createDateFromString } from '@api'

const supabase = createClientComponentClient()

export const getUserById = async (id: string): Promise<User[]> => {
  try {
    // Hacer la query
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    // Si no hay data o hay erro lanzar error
    if (data === null) {
      throw new Error()
    } else if (error !== null) {
      throw new Error()
    }

    const user: UserFromDB = data as UserFromDB

    // Si no tiene plan activo retornarlo
    if (user.active_plan === null) {
      // El usuario está registrado pero nunca ha tomado una clase
      return [user as User]
    }

    // Si tiene plan activo poblarlo
    const activePlanFromDb = await populate<SaleFromDb[]>({
      table: 'sales',
      ids: [user.active_plan],
      select: '*'
    })

    const { id: saleId, active, taken_classes: takenClasses, name, classes, total_price: totalPrice, sale_date: saleDate, start_date: startDate, end_date: endDate, pack_id: packId } = activePlanFromDb[0]

    return [{
      ...user,
      active_plan: {
        id: saleId,
        active,
        taken_classes: takenClasses,
        name,
        classes,
        total_price: totalPrice,
        sale_date: createDateFromString(saleDate),
        start_date: createDateFromString(startDate),
        end_date: createDateFromString(endDate),
        pack_id: packId
      }
    }]
  } catch (error) {
    return []
  }
}
