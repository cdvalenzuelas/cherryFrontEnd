// Lib
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Types and Componets
import type { DanceClass, DanceClassFromDB, User } from '@state'
import { createDateFromString, populate } from '@api'

const supabase = createClientComponentClient()

export const getClasses = async (year: number, month: number): Promise<DanceClass[]> => {
  const nextMonth = month === 11 ? 1 : month + 2
  const nextYear = month === 11 ? year + 1 : year

  try {
    // hace la query
    const { data, error } = await supabase
      .from('classes')
      .select('id, gender, mode, style, hour, teacher, users, date, difficulty, canceled, done, price')
      .gte('date', `${year}-${month + 1}-01`) // Mayor o igual que el 1 de enero de 2024
      .lt('date', `${nextYear}-${nextMonth}-01`)

    // Si no viene data o hay un error lanzar error
    if (data === null || data.length === 0) {
      throw new Error()
    } else if (error !== null) {
      throw new Error()
    }

    const classesFromDB = [...data] as DanceClassFromDB[]

    // Poblar las clases
    const teachersIds = classesFromDB.map(item => item.teacher)
    const usersIds = classesFromDB.map(item => item.users).flat()

    const idsSet = new Set([...teachersIds, ...usersIds])
    const ids2 = [...idsSet]

    const ids = ids2.filter(item => item !== null && item !== '')

    const users = await populate<User[]>({ table: 'users', ids, select: '*' })

    const classes: DanceClass[] = classesFromDB.map(item => {
      // Poblar el profesor
      const teacher = users.filter(item2 => item2.id === item.teacher)[0]

      // Poblar los usuarios
      let internalUsers = item.users.map(userId => {
        return users.filter(item3 => item3.id === userId)[0]
      })

      internalUsers = internalUsers.filter(item3 => item3 !== undefined)

      const dateOfClass = createDateFromString(item.date)

      return {
        ...item,
        teacher,
        users: internalUsers,
        date: dateOfClass
      }
    })

    return classes
  } catch {
    return []
  }
}
