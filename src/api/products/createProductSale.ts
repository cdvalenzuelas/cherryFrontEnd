/* eslint-disable @typescript-eslint/no-unused-vars */
// Libs
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Componets
import type { ProductSale } from '@state'

const supabase = createClientComponentClient()

interface Summary {
  product_id: string
  invoice: string
  quantity: number
  quantityFromDb: number
  price: number
  total: number
  profit: number
  discount?: number
}

export const createProductSale = async (summary: Summary[], date: string): Promise<ProductSale[]> => {
  const sale = summary.map(({ product_id: productId, quantity, discount }) => ({
    product_id: productId,
    quantity,
    discount
  }))
  const total = summary.reduce((a, b) => a + b.total, 0)
  const profit = summary.reduce((a, b) => a + b.profit, 0)

  const newDate = new Date(date)

  try {
    // Voy a insertar el plan
    const { data, error } = await supabase
      .from('sales')
      .insert({
        summary: sale,
        total,
        profit,
        date: newDate,
        year: newDate.getFullYear(),
        month: newDate.getMonth() + 1
      })
      .select()

    const createdProductSale: ProductSale[] | null = [
      ...(data as ProductSale[])
    ]

    // Si hay un error lanzar error
    if (createdProductSale.length === 0 || createdProductSale === null) {
      throw new Error()
    } else if (error !== null) {
      throw new Error()
    }

    return createdProductSale
  } catch {
    return []
  }
}
