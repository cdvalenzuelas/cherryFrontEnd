import { type StateCreator, create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { User } from '@state'

// *****************************TYPES****************************//

export type DanceGender = 'salsa' | 'bachata' | 'reggaeton' | 'dancehall' | 'afro' | 'champeta' | 'urban' | 'twerk' | 'sexyStyle' | 'latino' | 'urbano'

export type DanceMode = 'shining' | 'couple'

export type DanceDifficulty = 'principiantes' | 'basico' | 'intermedio'

// Todas las clases de baile y horarios tienen estas propiedades
interface BaseClass {
  id: string
  gender: DanceGender
  mode: DanceMode
  difficulty: DanceDifficulty
  style: string
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6
  hour: number
  price: number
}

// El horario que viene de la base de datos
export interface ScheduleClassFromDB extends BaseClass {
  teacher: string
}

// El horario utiliza la aplicación
export interface ScheduleClass extends Omit<ScheduleClassFromDB, 'teacher'> {
  teacher: User
}

// Las clases que vienen de la base de datos
export interface DanceClassFromDB extends Omit<BaseClass, 'day'> {
  teacher: string
  users: string[]
  canceled: boolean
  done: boolean
  date: string
}

// Las clases que usa la aplicación
export interface DanceClass extends Omit<DanceClassFromDB, 'teacher' | 'users' | 'date'> {
  teacher: User
  users: User[]
  date: Date
}

export interface AppSchedule {
  schedule: ScheduleClass[]
}

interface Actions {
  saveSchedule: (schedule: ScheduleClass[]) => void
}

// ***************************STATE*****************************//

const UserStateApi: StateCreator<AppSchedule & Actions> = (set, get) => ({
  schedule: [],
  saveSchedule: (schedule) => {
    set({ schedule }, false)
  }
})

export const useScheduleState = create<AppSchedule & Actions>()(
  devtools(UserStateApi)
)
