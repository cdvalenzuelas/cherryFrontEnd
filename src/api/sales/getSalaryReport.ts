import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type SalaryReport } from '@state'

const supabase = createClientComponentClient()

export const getSalaryReport = async (): Promise<SalaryReport[]> => {
  const { data, error } = await supabase
    .from('salary_report')
    .select('*')

  // Si no viene data o hay un error lanzar error
  if (data === null || data.length === 0) {
    throw new Error()
  } else if (error !== null) {
    throw new Error()
  }

  return data as SalaryReport[]
}
