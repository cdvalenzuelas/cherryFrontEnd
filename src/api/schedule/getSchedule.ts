// Lib
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Types and Componets
import type { ScheduleClass, ScheduleClassFromDB, User } from '@state'
import { populate } from '@api'

const supabase = createClientComponentClient()

export const getSchedule = async (): Promise<ScheduleClass[]> => {
  try {
    // Hacer la query
    const { data, error } = await supabase
      .from('schedule')
      .select('*')
      .order('hour', { ascending: true })

    // Si no viene data o hay unerror lazar error
    if (data === null || data.length === 0) {
      throw new Error()
    } else if (error !== null) {
      throw new Error()
    }

    const scheduleFromDB: ScheduleClassFromDB[] = [...data]

    // Poblar el horario
    const teachersIds = scheduleFromDB.map(item => item.teacher)

    const teachers = await populate<User[]>({ table: 'users', ids: teachersIds, select: '*' })

    const schedule: ScheduleClass[] = scheduleFromDB.map(item => {
      const teacherId = item.teacher
      const teacher = teachers.filter(item2 => item2.id === teacherId)[0]

      return { ...item, teacher }
    })

    return schedule
  } catch {
    return []
  }
}
