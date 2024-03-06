/* eslint-disable @typescript-eslint/no-unused-vars */
// Libs
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Componets
import type { DanceClass, DanceClassFromDB } from '@state'

interface DanceClassToCreatePrev extends Omit<DanceClassFromDB, 'id' | 'users' | 'date'> {
  users: string
  date: Date
  done: boolean
}

interface DateToUpdate {
  user_id: string
  id: string
  start_date: Date
  end_date: Date
}

const supabase = createClientComponentClient()

// Crea la clase en la base de datos
export const createClass = async (danceClass: DanceClass, datesToUpdate: DateToUpdate[]): Promise<DanceClass[]> => {
  const { id, teacher, users, date, ...rest } = danceClass

  // Se toman todos los ids de los usuarios
  const usersIds = users.map(item => item.id)

  // Se toman los pack a los culaes se les va a restar las clases

  // Se crea un nuevo objeto de clase de baile que sirve para crear la clase
  const danceClassToCreate: DanceClassToCreatePrev = {
    ...rest,
    teacher: teacher.id,
    users: `{"${usersIds.join('","')}"}`, // Es necesario hacerlo así para que supabase lo entienda
    date,
    done: true
  }

  try {
    // Crear la clase con una query
    const { data, error } = await supabase
      .from('classes')
      .insert(danceClassToCreate)
      .select()

    // Si hay un error o no viene data generar un error
    if (data === null || data.length === 0) {
      throw new Error()
    } else if (error !== null) {
      throw new Error()
    }

    const classesFromDB: DanceClassFromDB = data[0] as DanceClassFromDB

    // Registrar las clases de los usuarios en DB
    // Traer los ids de los usuarios para registrar clases
    const salesId = danceClass.users.map(user => user.active_plan?.id).filter(item => item !== undefined) as string[]

    const { data: data2, error: error2 } = await supabase.rpc('incrementclass', { tablename: 'sales', columnname: 'taken_classes', ids: salesId })

    // Si hay un error o no viene data generar un error
    if (error2 !== null) {
      throw new Error()
    }

    const promesas = datesToUpdate.map(item =>
      supabase
        .from('sales')
        .update({ start_date: item.start_date, end_date: item.end_date })
        .eq('id', item.id)
    )

    const resultados = await Promise
      .all(promesas)
      .catch(() => {
        throw new Error()
      })

    // Tomar el id de la clase creada y agregarla ala estado
    return [{
      ...danceClass,
      id: classesFromDB.id,
      date: new Date(danceClass.date)
    }]
  } catch {
    return []
  }
}
