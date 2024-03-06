// Libs
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Componets
import type { Payment } from '@state'

const supabase = createClientComponentClient()

export const getPayments = async (): Promise<Payment[]> => {
  try {
    // Voy a insertar el plan
    const { data, error } = await supabase
      .from('payments')
      .select('*')

    const paymentCreated: Payment[] | null = [...data as Payment[]]

    // Si hay un error lanzar error
    if (paymentCreated.length === 0 || paymentCreated === null) {
      throw new Error()
    } else if (error !== null) {
      throw new Error()
    }

    return paymentCreated
  } catch {
    return []
  }
}
