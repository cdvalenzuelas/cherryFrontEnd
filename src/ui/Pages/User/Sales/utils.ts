import type { Pack, Sale, PackPeriod, PaymentMode } from '@state'

export type nameOptions = 'pack' | 'paymentMode'

export const paymentModes: PaymentMode[] = ['chash', 'daviplata', 'nequi', 'tranfer', 'tranfiya']
export const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
export const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

const periods: Record<PackPeriod, string[]> = {
  day: ['Día', 'Días'],
  month: ['Mes', 'Meses'],
  week: ['Semana', 'Semanas'],
  year: ['Año', 'Años']
} as const

export const duaration = (classes: number, duration: number, period: PackPeriod) => {
  let textClasse = ''
  const textDuration = duration === 1
    ? period === 'week' ? 'Una' : 'Un'
    : String(duration)
  const textPeriod = duration === 1
    ? periods[period][0]
    : periods[period][1]

  if (classes === -1) {
    textClasse = 'Clases Ilimitadas / ' + textDuration + ' ' + textPeriod
  } else if (classes === 1) {
    textClasse = 'Una Clase'
  } else {
    textClasse = String(classes) + ' Clases / ' + textDuration + ' ' + textPeriod
  }

  return textClasse
}

export const endDateOfPack = (period: PackPeriod, duration: number): [string, Date, number] => {
  const currentDate = new Date()
  const startDate = new Date()

  // Somarle 15 dias a la fecha de hoy
  startDate.setDate(currentDate.getDate() + 15)

  const endDate: Date = new Date(startDate)

  if (period === 'day') {
    startDate.setDate(startDate.getDate() - 15)
    endDate.setDate(endDate.getDate() - 15)
  } else if (period === 'month') {
    endDate.setMonth(endDate.getMonth() + duration)
    endDate.setDate(endDate.getDate() - 1)
  } else if (period === 'week') {
    endDate.setDate(endDate.getDate() + 7 * duration)
  }

  const dayName = days[startDate.getDay()]
  const day = startDate.getDate()
  const monthName = months[startDate.getMonth()]
  const year = startDate.getFullYear()

  // Cambiar el estado de los componetes
  return [
    `${dayName} ${day} de ${monthName} de ${year}`,
    endDate,
    currentDate.getDate()
  ]
}

export const createDefaultSale = (pack: Pack): Sale => {
  return {
    pack_id: pack.id,
    user_id: '',
    sale_date: new Date(),
    start_date: new Date(),
    end_date: new Date(),
    classes: pack.classes,
    taken_classes: 0,
    active: true,
    discount: 0,
    discount_description: '',
    payment_mode: 'chash',
    price: pack.price,
    total_price: pack.price,
    name: pack.name
  }
}
