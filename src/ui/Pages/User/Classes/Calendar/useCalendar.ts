import { useState, useEffect, type MouseEvent } from 'react'
import { useClassesState, useScheduleState, useUserState, type ScheduleClass, useDateState, type AppDate, type DanceClass } from '@state'
import { getClasses } from '@/api'

interface Props {
  userId2: string | null
}

export const useCalendar = ({ userId2 }: Props) => {
  const getDate = useDateState(state => state.getDate)
  const userId = useUserState(state => state.id)
  const userRole = useUserState(state => state.role)
  const schedule = useScheduleState(state => state.schedule)
  const hoursOfClassesByDay = useClassesState(state => state.hoursOfClassesByDay)
  const classesStore = useClassesState(state => state.classesStore)
  const setHoursOfClassesByDay = useClassesState(state => state.setHoursOfClassesByDay)
  const saveClasses = useClassesState(state => state.saveClasses)

  const [classes, setClasses] = useState<DanceClass[]>(() => classesStore[`${getDate().year}-${getDate().month}`])
  const [state, setState] = useState<AppDate>({ day: 1, month: 1, year: 1, startDay: 1, daysAtMoth: 1 })
  const [isOpnenMobileModals, setIsOpenMobileModals] = useState<Record<string, boolean>>({})
  const [isOpnenEditableModals, setIsOpenEditableModals] = useState<Record<string, boolean>>({})
  const [isOpnenReadableModals, setIsOpenReadableModals] = useState<Record<string, boolean>>({})
  const [classToEdit, setClassToEdit] = useState<ScheduleClass>(schedule[0])
  const [classToRead, setClassToRead] = useState<DanceClass>(classes[0])

  const currentDate = new Date()

  useEffect(() => {
    // Saber en que mes y año estamos
    const data = getDate()

    const internalIsOpnenModals: Record<string, boolean> = {}

    for (let i = 1; i <= data.daysAtMoth; i++) {
      internalIsOpnenModals[i] = false
    }

    setIsOpenMobileModals(internalIsOpnenModals)
    setIsOpenEditableModals(internalIsOpnenModals)
    setIsOpenReadableModals(internalIsOpnenModals)

    setHoursOfClassesByDay(`${data.year}-${data.month}`)
    setState(data)
  }, [])

  useEffect(() => {
    if (state.year !== 1) {
      setHoursOfClassesByDay(`${state.year}-${state.month}`)
      setClasses(classesStore[`${state.year}-${state.month}`])
    }
  }, [JSON.stringify(classesStore), JSON.stringify(state)])

  const handleClick = (e: MouseEvent<HTMLButtonElement>, day: number) => {
    const name = e.currentTarget.name as 'mobile' | 'readable' | 'editable'
    const value = e.currentTarget.value

    const isOpnenModals2 = JSON.parse(JSON.stringify(isOpnenMobileModals)) as Record<string, boolean>

    if (name === 'mobile') {
      isOpnenModals2[day] = !isOpnenModals2[day]

      setIsOpenMobileModals(isOpnenModals2)
    } else if (name === 'editable') {
      const currentTarget2 = schedule.filter(item => item.id === value)[0]

      const isOpnenModals3 = JSON.parse(JSON.stringify(isOpnenEditableModals)) as Record<string, boolean>

      isOpnenModals2[day] = false
      isOpnenModals3[day] = !isOpnenModals3[day]

      setIsOpenEditableModals(isOpnenModals3)
      setIsOpenMobileModals(isOpnenModals2)
      setClassToEdit(currentTarget2)
    } else if (name === 'readable') {
      const currentTarget2 = classes.filter(item => item.id === value)[0]
      const isOpnenModals3 = JSON.parse(JSON.stringify(isOpnenReadableModals)) as Record<string, boolean>

      isOpnenModals2[day] = false
      isOpnenModals3[day] = !isOpnenModals3[day]

      setIsOpenReadableModals(isOpnenModals3)
      setIsOpenMobileModals(isOpnenModals2)
      setClassToRead(currentTarget2)
    }
  }

  const handleMonth = (e: MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name as 'more' | 'less' | 'today'
    const { month, year } = state
    let input: undefined | { month: number, year: number }

    if (name === 'less') {
      const newMonth = month === 0 ? 11 : month - 1
      const newYear = month === 0 ? year - 1 : year

      input = { month: newMonth, year: newYear }
    } else if (name === 'more') {
      const newMonth = month === 11 ? 0 : month + 1
      const newYear = month === 11 ? year + 1 : year

      input = { month: newMonth, year: newYear }
    }

    input = input?.month === currentDate.getMonth() && input.year === currentDate.getFullYear() ? undefined : input

    const data = getDate(input)

    getNewClasses(data)
  }

  const getNewClasses = async (data: {
    day: number
    month: number
    year: number
    daysAtMoth: number
    startDay: number
  }) => {
    const condition = classesStore[`${data.year}-${data.month}`] === undefined

    if (condition) {
      const newClasses = await getClasses(data.year, data.month)
      saveClasses(`${data.year}-${data.month}`, newClasses)
    }

    const internalIsOpnenModals: Record<string, boolean> = {}

    for (let i = 1; i <= data.daysAtMoth; i++) {
      internalIsOpnenModals[i] = false
    }

    setIsOpenMobileModals(internalIsOpnenModals)
    setIsOpenEditableModals(internalIsOpnenModals)
    setIsOpenReadableModals(internalIsOpnenModals)
    setHoursOfClassesByDay(`${data.year}-${data.month}`)
    setState(data)
  }

  return {
    date: { ...state },
    classes: {
      classToEdit,
      hoursOfClassesByDay,
      classes: userId2 === null ? classes : classes.filter(item => item.users.map(item2 => item2.id).includes(userId2)),
      schedule: userId2 === null ? schedule : [],
      classToRead
    },
    modals: {
      isOpnenEditableModals,
      isOpnenMobileModals,
      isOpnenReadableModals,
      setIsOpenEditableModals
    },
    handleClick,
    handleMonth,
    userRole,
    userId
  }
}
