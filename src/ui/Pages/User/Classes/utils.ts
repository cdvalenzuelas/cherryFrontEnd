import type { DanceGender, DanceMode, DanceDifficulty } from '@state'

export const determinateDay = (day: number, start: number) => {
  const newDay = (day % 7) + start - 1

  return newDay === -1 ? 6 : newDay % 7
}

export const moths = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
]

export const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export const danceGenders: DanceGender[] = ['salsa', 'bachata', 'reggaeton', 'dancehall', 'afro', 'champeta', 'urban', 'twerk', 'sexyStyle', 'latino', 'urbano']

export const danceMode: DanceMode[] = ['couple', 'shining']

export const danceDifficulty: DanceDifficulty[] = ['principiantes', 'basico', 'intermedio']
