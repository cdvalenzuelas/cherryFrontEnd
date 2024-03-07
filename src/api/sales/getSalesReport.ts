import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type SalesReport } from '@state'

const supabase = createClientComponentClient()

export const getSalesReport = async (): Promise<SalesReport[]> => {
  const { data, error } = await supabase
    .from('sales_report')
    .select('*')

  // Si no viene data o hay un error lanzar error
  if (data === null || data.length === 0) {
    throw new Error()
  } else if (error !== null) {
    throw new Error()
  }

  return data as SalesReport[]
}
