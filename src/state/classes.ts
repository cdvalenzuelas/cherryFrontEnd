import { type StateCreator, create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { DanceClass } from '@state'

// *****************************TYPES****************************//
export interface AppClasses {
  classesStore: Record<string, DanceClass[]>
}

interface Actions {
  saveClasses: (yearMonth: string, classes: DanceClass[]) => void
  addClass: (yearMonth: string, newClass: DanceClass) => void
  hoursOfClassesByDay: Record<string, number[]>
  setHoursOfClassesByDay: (yearMonth: string) => void
}

// ***************************STATE*****************************//

const UserStateApi: StateCreator<AppClasses & Actions> = (set, get) => ({
  hoursOfClassesByDay: {},
  classesStore: {},
  saveClasses: (yearMonth, classes) => {
    const classesStore = get().classesStore
    classesStore[yearMonth] = classes

    set({ classesStore })
  },
  addClass: (yearMonth, newClass) => {
    const classesStore = get().classesStore
    classesStore[yearMonth] = [...classesStore[yearMonth], newClass]

    set({ classesStore })
  },
  setHoursOfClassesByDay: (yearMonth) => {
    let internalHoursOfClassesByDay: Record<string, number[]> = {}

    get().classesStore[yearMonth].forEach(item => {
      const date = new Date(item.date)
      const day = String(date.getDate())

      let value: Record<string, number[]>

      if (!Object.keys(internalHoursOfClassesByDay).includes(day)) {
        value = { [day]: [item.hour] }
      } else {
        value = { [day]: [...internalHoursOfClassesByDay[day], item.hour] }
      }

      internalHoursOfClassesByDay = { ...internalHoursOfClassesByDay, ...value }
    })

    set({ hoursOfClassesByDay: internalHoursOfClassesByDay })
  }
})

export const useClassesState = create<AppClasses & Actions>()(
  devtools(UserStateApi)
)
