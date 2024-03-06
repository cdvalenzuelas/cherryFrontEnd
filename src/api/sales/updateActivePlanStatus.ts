// Libs
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

// Crea la clase en la base de datos
export const updateActivePlanStatus = async (salesIds: string[]): Promise<void> => {
  // Crear la clase con una query
  const { data, error } = await supabase
    .from('sales')
    .update({ active: false })
    .in('id', salesIds)

  // Si hay un error o no viene data generar un error
  if (data === null) {
    throw new Error()
  } else if (error !== null) {
    throw new Error()
  }
}
