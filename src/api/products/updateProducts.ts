// Libs
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Product } from '@state'

const supabase = createClientComponentClient()

interface ProductsToUpdate {
  id: string
  quantity: number
}

// Crea la clase en la base de datos
export const updateProducts = async (productsToUpdate: ProductsToUpdate[]): Promise<Product[]> => {
  try {
    const promesas = productsToUpdate.map((item) =>
      supabase
        .from('products')
        .update({ quantity: item.quantity })
        .eq('id', item.id)
        .select()
    )

    const resultados = await Promise.all(promesas)
    const resultados2 = resultados.map(item => {
      const data = item.data as Product[]
      return data[0]
    })
    return resultados2
  } catch {
    return []
  }
}
