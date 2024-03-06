// Libs
import { type FC, type MouseEvent } from 'react'

// Components |  State
import { type UserRole, type ScheduleClass } from '@state'
import { Button } from '@nextui-org/react'
import styles from './styles.module.css'

interface Props {
  dayOfMonth: number
  month: number
  year: number
  scheduleByDay: ScheduleClass[]
  userRole: UserRole
  handleClick: (e: MouseEvent<HTMLButtonElement>, day: number) => void
}

export const DesktopEditableClassButtons: FC<Props> = ({ dayOfMonth, scheduleByDay, userRole, handleClick }) => {
  return (<>
    {scheduleByDay.map(danceClass => {
      // SI YA HAY UNA CLASE LLENA NO SE RENDERICE LA DEL HORARIO
      const condition2 = userRole === 'admin' || userRole === 'superAdmin'

      return condition2
        ? <Button
          onClick={e => { handleClick(e, dayOfMonth) }}
          size='sm'
          radius='sm'
          name='editable'
          key={danceClass.id}
          className={styles.class} >
          {danceClass.gender}
        </Button>
        : null
    })}
  </>)
}
