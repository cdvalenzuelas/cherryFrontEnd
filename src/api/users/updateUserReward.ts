/* eslint-disable @typescript-eslint/no-unused-vars */
// Libs
import { type User } from '@/state'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

interface Props {
  referralUser: User
  sale: number
  userId: string
}

// Crea la clase en la base de datos
export const updateUserReward = async ({ referralUser, sale, userId }: Props): Promise<void> => {
  // Crear la clase con una query
  const { data, error } = await supabase
    .from('users')
    .update({ reward: referralUser.reward + sale })
    .in('id', [referralUser.id])
    .select()

  const { data: data2, error: error2 } = await supabase
    .from('users')
    .update({ reward: 0 })
    .in('id', [userId])
    .select()

  // Si hay un error o no viene data generar un error
  if (data === null) {
    throw new Error()
  } else if (error !== null) {
    throw new Error()
  }
}
