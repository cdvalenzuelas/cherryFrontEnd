/* eslint-disable @typescript-eslint/no-unused-vars */
// Libs
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Componets
import type { Salary } from '@state'

const supabase = createClientComponentClient()

export const createSalary = async ({ date, amount, year, month }: Salary): Promise<Salary[]> => {
  const newDate = new Date(date)

  newDate.setDate(newDate.getDate() + 1)

  try {
    // Voy a insertar el plan
    const { data, error } = await supabase
      .from('salary')
      .insert({ date: newDate, amount, year, month })
      .select('*')

    const salary = data as Salary[]

    // Si hay un error lanzar error
    if (salary.length === 0 || salary === null) {
      throw new Error()
    } else if (error !== null) {
      throw new Error()
    }

    return data as Salary[]
  } catch {
    return []
  }
}
