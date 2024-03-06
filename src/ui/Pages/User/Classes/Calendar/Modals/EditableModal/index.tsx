import { Modal, ModalContent } from '@nextui-org/react'
import { Form } from './Form'
import { Info } from './Info'
import { type SetStateAction, type Dispatch, type FC, useEffect, useState } from 'react'

import styles from '../styles.module.css'
import { type ScheduleClass, type DanceClass } from '@/state'

interface Props {
  classToEdit: ScheduleClass
  dayOfMonth: number
  month: number
  year: number
  setIsOpenEditableModals: Dispatch<SetStateAction<Record<string, boolean>>>
  isOpnenEditableModals: Record<string, boolean>
}

export const EditableModal: FC<Props> = ({ classToEdit, dayOfMonth, month, year, setIsOpenEditableModals, isOpnenEditableModals }) => {
  const [internalDanceClass, setInternalDanceClass] = useState<DanceClass>({
    ...classToEdit,
    users: [],
    canceled: false,
    done: false,
    date: new Date(year, month, dayOfMonth)
  })

  useEffect(() => {
    setInternalDanceClass({
      ...classToEdit,
      users: [],
      canceled: false,
      done: false,
      date: new Date(year, month, dayOfMonth)
    })
  }, [dayOfMonth, month, year, classToEdit])

  return <Modal isOpen={true} backdrop='blur' size='3xl' placement='center' className={`${styles.editableModal}`}>
    <ModalContent>

      <Info
        danceClass={internalDanceClass}
        dayOfMonth={dayOfMonth}
        month={month}
        year={year}
        editable={true}
      />

      <Form
        danceClass={internalDanceClass}
        setIsOpenEditableModals={setIsOpenEditableModals}
        isOpnenEditableModals={isOpnenEditableModals}
        setInternalDanceClass={setInternalDanceClass}
      />

    </ModalContent>
  </Modal >
}
