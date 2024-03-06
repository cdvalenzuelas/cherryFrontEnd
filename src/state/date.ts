import { type StateCreator, create } from 'zustand'
import { devtools } from 'zustand/middleware'

// ******************TYPES********************
export interface AppDate {
  day: number
  month: number
  year: number
  startDay: number
  daysAtMoth: number
}
interface Data {
  month: number
  year: number
}
interface Actions {
  getDate: (data?: Data) => { day: number, month: number, year: number, daysAtMoth: number, startDay: number }
}
// ************************STATE***********************

const UserStateApi: StateCreator<AppDate & Actions> = (set, get) => ({
  day: 1,
  month: 1,
  year: 1,
  startDay: 0,
  daysAtMoth: 0,
  getDate: (data) => {
    const date = data === undefined ? new Date() : new Date(data.year, data.month, 1)
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = data === undefined ? date.getDate() : 0

    // DETERMINATE THE DAYS OF THE MOTH
    const nextMoth = month === 11 ? 1 : month + 1
    const nextYear = month === 11 ? year + 1 : year
    const date1 = new Date(nextYear, nextMoth, 1)
    const date2 = date1.setDate(date1.getDate() - 1)
    const date3 = new Date(date2)
    const daysAtMoth = date3.getDate()

    // SABER EN QUE DÍA INICIAL EL MES
    const date4 = new Date(year, month, 1)
    const startDay = date4.getDay()

    set({ day, month, year, daysAtMoth, startDay })

    return { day, month, year, daysAtMoth, startDay }
  }
})

export const useDateState = create<AppDate & Actions>()(
  devtools(UserStateApi)
)
