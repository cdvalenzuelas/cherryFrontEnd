import type { User, Sale, Pack, PaymentMode } from '@state'
import { endDateOfPack } from '../../utils'

interface Props {
  user: User | null
  sale: Sale
  pack: Pack
  paymentMode: PaymentMode
  referralUser: User | null
}

export const useUserAndPackChange = ({ user, sale, pack, paymentMode, referralUser }: Props) => {
  // DEFINIR TODAS LAS CONSTANTES
  let internalSale = JSON.parse(JSON.stringify(sale)) as Sale
  const { duration, period, classes, price, name, id } = pack
  const [startDateMessage, endDate, currentDay] = endDateOfPack(period, duration)
  const istPromotionsDays = currentDay <= 5 || (currentDay >= 15 && currentDay <= 20)
  let promotion = ''
  let userId = ''
  let discountPercentage = 0
  let discountDescription = ''
  let courtesPackId = 'ac57ae16-3603-4c4a-ac43-4955f3f05106'

  internalSale.payment_mode = paymentMode

  // Cambia el pack
  internalSale = {
    ...internalSale,
    pack_id: id,
    end_date: endDate,
    classes,
    price,
    name,
    total_price: price
  }

  // Si elimina el usuario
  if (user === null) {
    courtesPackId = ''
    promotion = ''
  } else {
    userId = user.id
    // Si es una cortesía
    if (user.active_plan === null || user.active_plan.name === 'cortesia') {
      promotion = 'Eres nuevo por aquí, así que te damos hasta un 20% de descuento en tu primera compra (aplica para todos los planes).'
      discountPercentage = referralUser === null ? 0.15 : 0.2
      discountDescription = 'new user'
      courtesPackId = ''
    } else {
      // Si su plan está vencido pero hay día de promoció
      if (!user.active_plan.active && istPromotionsDays) {
        promotion = 'Si renuevas el día de hoy optienes un 10% de descuento (aplica para todos los planes).'
        discountPercentage = 0.1
        discountDescription = 'biweekly renewa'
      }
    }
  }

  const reward = user == null ? 0 : user.reward

  internalSale = {
    ...internalSale,
    user_id: userId,
    discount: price * discountPercentage + reward,
    total_price: price * (1 - discountPercentage) - reward,
    discount_description: discountDescription
  }

  if (pack.period === 'day' || pack.period === 'week') {
    internalSale = {
      ...internalSale,
      discount: 0,
      total_price: price,
      discount_description: ''
    }
  }

  return {
    startDateMessage,
    promotion,
    internalSale,
    courtesPackId
  }
}
