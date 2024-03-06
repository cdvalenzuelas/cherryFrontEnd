import { createSale, updateUserReward } from '@/api'
import { useSalesState, useUserState, useUsersState, type Sale, type User } from '@/state'

interface Props {
  internalSale: Sale
  referralUser: User | null
}

export const useCreatesale = ({ internalSale, referralUser }: Props) => {
  const addSale = useSalesState(state => state.addSale)
  const activateUser = useUserState(state => state.activateUser)
  const updateUserPack = useUsersState(state => state.updateUserPack)

  const cretaSale2 = async () => {
    const [sale] = await createSale(internalSale)

    if (referralUser !== null) {
      await updateUserReward({ referralUser, sale: internalSale.price * 0.05, userId: internalSale.user_id })
      updateUserPack(referralUser.id, sale, internalSale.price * 0.05, false)
    }

    addSale(sale)
    updateUserPack(sale.user_id, sale, 0, true)
    activateUser(sale)
  }

  return { createSale: cretaSale2 }
}
