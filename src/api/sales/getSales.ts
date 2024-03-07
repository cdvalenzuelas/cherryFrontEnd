import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type ProductSale } from '@state'

const supabase = createClientComponentClient()

export const getSales = async (): Promise<ProductSale[]> => {
  const { data, error } = await supabase
    .from('sales')
    .select('*')

  // Si no viene data o hay un error lanzar error
  if (data === null || data.length === 0) {
    throw new Error()
  } else if (error !== null) {
    throw new Error()
  }

  return data as ProductSale[]
}
