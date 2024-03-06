// Libs
import { useState, useEffect, type ChangeEvent, type MouseEvent, type Dispatch, type SetStateAction } from 'react'

// Typos
import type { DanceClass, DanceDifficulty, DanceGender, DanceMode, User } from '@state'
import { useUsersState, usePacksState } from '@state'
import { useCreateClass, useDeleteClass } from '@apiInternal'

interface Props {
  danceClass: DanceClass
  setInternalDanceClass: Dispatch<SetStateAction<DanceClass>>
  setIsOpenEditableModals: Dispatch<SetStateAction<Record<string, boolean>>>
  isOpnenEditableModals: Record<string, boolean>
}

type nameOptions = 'teacher' | 'users' | 'mode' | 'difficulty' | 'gender' | 'mode' | 'preview'

export const useForm = ({ danceClass, setInternalDanceClass, setIsOpenEditableModals, isOpnenEditableModals }: Props) => {
  const [teachers, setTeachers] = useState<User[]>([])
  const getTeachers = useUsersState(state => state.getTeachers)
  const packs = usePacksState(state => state.packs)
  const [arrowState, setArrowState] = useState<boolean>(false)
  const [userWishDeleteClass, setUserWishDeleteClass] = useState<boolean>(false)
  const { deleteClass } = useDeleteClass({ danceClass })
  const { createClass } = useCreateClass({ danceClass, packs })
  const [saveButtonIsDisabled, setSaveButtonIsDisabled] = useState<boolean>(false)

  useEffect(() => {
    setTeachers(getTeachers())
  }, [])

  const updateModals = () => {
    const isOpnenModals2 = JSON.parse(JSON.stringify(isOpnenEditableModals)) as Record<string, boolean>

    isOpnenModals2[danceClass.date.getDate()] = !isOpnenModals2[danceClass.date.getDate()]
    setIsOpenEditableModals(isOpnenModals2)
  }

  // Modificación de precio y estilo
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as 'price' | 'style'
    const value = e.currentTarget.value

    setInternalDanceClass({
      ...danceClass,
      [name]: value
    })
  }

  // Seleccionar items seleccionables
  const handleClick = (e: MouseEvent<HTMLLIElement>, name: nameOptions) => {
    const id = e.currentTarget.dataset.key as string

    if (name === 'teacher') {
      const usersIds = danceClass.users.map(user => user.id)
      const teacher = teachers.filter(item => item.id === id && !usersIds.includes(id))[0]
      setInternalDanceClass({ ...danceClass, teacher })
    } else if (name === 'gender') {
      const gender = e.currentTarget.dataset.key as DanceGender
      setInternalDanceClass({ ...danceClass, gender })
    } else if (name === 'difficulty') {
      const difficulty = e.currentTarget.dataset.key as DanceDifficulty
      setInternalDanceClass({ ...danceClass, difficulty })
    } else if (name === 'mode') {
      const mode = e.currentTarget.dataset.key as DanceMode
      setInternalDanceClass({ ...danceClass, mode })
    }
  }

  // Eliminar la clase
  const handleConfirmDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    await deleteClass()
    updateModals()
  }

  // Cerrar el modal
  const handleClose = async (e: MouseEvent<HTMLButtonElement>) => {
    updateModals()
  }

  // Crear la clase
  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    setSaveButtonIsDisabled(true)
    await createClass() // cambiamos los datos en el estado de la aplicación
    updateModals() // actualizamos modales
    setSaveButtonIsDisabled(false)
  }

  // Seleccionar usuarios
  const getSelectedUsers = (users: User[]) => {
    setInternalDanceClass({
      ...danceClass,
      users
    })
  }

  return {
    teachers,
    setTeachers,
    handleSubmit,
    handleChange,
    handleClick,
    handleConfirmDelete,
    handleClose,
    setArrowState,
    setUserWishDeleteClass,
    getSelectedUsers,
    arrowState,
    userWishDeleteClass,
    saveButtonIsDisabled
  }
}
