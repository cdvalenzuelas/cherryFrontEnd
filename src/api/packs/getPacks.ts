// Lib
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Types and Componets
import type { Pack } from '@state'

const supabase = createClientComponentClient()

export const getPacks = async (): Promise<Pack[]> => {
  try {
    // Hacer la query
    const { data, error } = await supabase
      .from('packs')
      .select('*')

    // si no viene data o hay un error, lanzar error
    if (data === null || data.length === 0) {
      throw new Error()
    } else if (error !== null) {
      throw new Error()
    }

    const packs: Pack[] = [...data]

    return packs
  } catch {
    return []
  }
}
