import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

interface Input {
  ids: string[]
  table: string
  select: string
}

// Popular arrays de ids
export const populate = async <T>({ table, select, ids }: Input): Promise<T> => {
  try {
    // Hacer la query
    const { data, error } = await supabase
      .from(table)
      .select(select)
      .in('id', ids)

    // Si no viene data o hay error lanzar erro
    if (data === null || data.length === 0) {
      throw new Error()
    } else if (error !== null) {
      throw new Error()
    }

    return data as T
  } catch (error) {
    return [] as T
  }
}
