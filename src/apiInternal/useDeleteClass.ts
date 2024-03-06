import { createClass } from '@/api/classes/createClass'
import { type DanceClass, useClassesState } from '@state'

interface Props {
  danceClass: DanceClass
}

export const useDeleteClass = ({ danceClass }: Props) => {
  const deleteClass = async () => {
    const addClass = useClassesState(state => state.addClass)
    let newClassToCreate = JSON.parse(JSON.stringify(danceClass)) as DanceClass

    newClassToCreate = {
      ...newClassToCreate,
      canceled: true,
      price: 0,
      users: [],
      done: true
    }

    const [data] = await createClass(newClassToCreate, [])

    const date = new Date(data.date)

    addClass(`${date.getFullYear()}-${date.getMonth()}`, data)
  }

  return { deleteClass }
}
