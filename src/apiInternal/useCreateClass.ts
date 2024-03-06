import { createClass } from '@/api/classes/createClass'
import { type Pack, type DanceClass, useUsersState, useClassesState } from '@/state'

interface Props {
  danceClass: DanceClass
  packs: Pack[]
}

interface DateToUpdate {
  user_id: string
  id: string
  start_date: Date
  end_date: Date
}

export const useCreateClass = ({ danceClass, packs }: Props) => {
  const udateUsersTakenClasses = useUsersState(state => state.udateUsersTakenClasses)
  const updateUsersDates = useUsersState(state => state.updateUsersDates)
  const addClass = useClassesState(state => state.addClass)

  const createClass2 = async () => {
    // Vamos a comparar fechas
    const classDate = danceClass.date

    // Extraemos de la clase los ids de los usuarios, sus fechas de inicio, y el plan activo que tienen
    const usersDates = danceClass.users.map(user => {
      return {
        user_id: user.id,
        id: user.active_plan?.id as string,
        startDate: user.active_plan?.start_date as Date,
        packId: user.active_plan?.pack_id as string
      }
    })

    const usersIds = usersDates.map(item => item.user_id)

    const datesToUpdate: DateToUpdate[] = []

    // Si tomó clases antes de los 15 días
    usersDates.forEach(({ startDate, id, packId, user_id: userId }) => {
      if (classDate < startDate) {
        const { duration, period } = packs.filter(pack => pack.id === packId)[0]
        const endDate = new Date(classDate)

        if (period === 'month') {
          endDate.setMonth(endDate.getMonth() + duration)
          endDate.setDate(endDate.getDate() - 1)
        } else if (period === 'week') {
          endDate.setDate(endDate.getDate() + 7 * duration)
        }

        datesToUpdate.push({
          user_id: userId,
          id,
          start_date: classDate,
          end_date: endDate
        })
      }
    })
    // Actualizar las clases de los usuarios en el estado
    const [data] = await createClass(danceClass, datesToUpdate)

    updateUsersDates(datesToUpdate)
    udateUsersTakenClasses(usersIds)
    addClass(`${classDate.getFullYear()}-${classDate.getMonth()}`, data)
  }

  return { createClass: createClass2 }
}
