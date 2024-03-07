// Lib
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Types and Componets
import type { Salary } from '@state'

const supabase = createClientComponentClient()

export const getSalary = async (): Promise<Salary[]> => {
  try {
    // Hacer la query
    const { data, error } = await supabase.from('salary').select('*')

    // Si no viene data o hay unerror lazar error
    if (data === null || data.length === 0) {
      throw new Error()
    } else if (error !== null) {
      throw new Error()
    }

    return data as Salary[]
  } catch {
    return []
  }
}
