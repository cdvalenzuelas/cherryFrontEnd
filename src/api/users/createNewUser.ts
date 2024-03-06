import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { User, UserFromDB } from '@state'

const supabase = createClientComponentClient()

// Crear un nuevo usuario
export const createNewUser = async (user: Partial<User>): Promise<User[]> => {
  try {
    // Hacer la query e insertar la clase
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()

    // si no viene data o hay un error lanzar error
    if (data === null || data.length === 0) {
      throw new Error()
    } else if (error !== null) {
      throw new Error()
    }

    const newUser: UserFromDB = data[0]

    // Retornar el usuario creado en db incluyendo su id
    return [{
      ...newUser,
      active_plan: null
    }]
  } catch {
    return []
  }
}
