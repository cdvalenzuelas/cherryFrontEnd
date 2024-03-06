import { type FC, type MouseEvent } from 'react'

import { Modal, ModalContent, ModalBody, ModalFooter, Button, User, Chip, Divider, ModalHeader } from '@nextui-org/react'
import { type ScheduleClass, type DanceClass, type UserRole } from '@/state'
import styles from '../styles.module.css'
import { days } from '../../../utils'

interface Props {
  scheduleByDay: ScheduleClass[]
  classesByDay: DanceClass[]
  handleClick: (e: MouseEvent<HTMLButtonElement>, day: number) => void
  dayOfMonth: number
  month: number
  year: number
  dayOfWeek: number
  userRole: UserRole
  userId: string
}

export const MobileDayModal: FC<Props> = ({ scheduleByDay, classesByDay, handleClick, dayOfMonth, month, year, dayOfWeek, userRole, userId }) => {
  // Traer las clases dependiendo de si es admin o no
  classesByDay = classesByDay.filter(item => {
    if (userRole === 'admin' || userRole === 'superAdmin') {
      return true
    }

    const usersIds = item.users.map(item2 => item2.id)
    if (usersIds.includes(userId)) {
      return true
    }

    const teacherId = item.teacher.id
    if (userId === teacherId) {
      return true
    }

    return false
  })

  return <Modal isOpen={true} backdrop='blur' size='3xl' className={styles.mobileDayModal}>
    <ModalContent >

      <ModalHeader>
        {days[dayOfWeek]} {dayOfMonth < 10 ? `0${dayOfMonth}` : dayOfMonth} / {month < 9 ? `0${month + 1}` : month + 1} / {year}
      </ModalHeader>

      <Divider />

      <ModalBody className='flex flex-col gap-2 my-2'>

        {(userRole === 'admin' || userRole === 'superAdmin') && scheduleByDay.map(item => (<Button
          className='flex justify-between items-center h-12'
          style={{ order: item.hour }}
          variant='flat'
          startContent={<User
            name={item.teacher.name}
            description={item.teacher.instagram_id}
            avatarProps={{
              src: item.teacher.image,
              size: 'sm'
            }}
          />}
          endContent={
            <Chip color='secondary' size='sm'>{item.hour} a {item.hour + 1}</Chip>
          }
          key={item.id}
          color='warning'
          name='editable'
          value={item.id}
          onClick={e => { handleClick(e, dayOfMonth) }} >
          {item.gender}
        </Button>))}

        {classesByDay.map(item => (<Button
          className='flex justify-between items-center h-12'
          style={{ order: item.hour }}
          variant='flat'
          startContent={<User
            name={item.teacher.name}
            description={item.teacher.instagram_id}
            avatarProps={{
              src: item.teacher.image,
              size: 'sm'
            }}
          />}
          endContent={
            <Chip color='secondary' size='sm'>{item.hour} a {item.hour + 1}</Chip>
          }
          key={item.id}
          color={item.canceled ? 'danger' : 'success'}
          name='readable'
          value={item.id}
          onClick={e => { handleClick(e, dayOfMonth) }} >
          {item.gender}
        </Button>))}

      </ModalBody>

      <Divider />

      <ModalFooter>
        <Button size='sm' name='mobile' onClick={e => { handleClick(e, dayOfMonth) }} color='danger' variant='ghost'>Cerrar</Button>
      </ModalFooter>

    </ModalContent>
  </Modal >
}
