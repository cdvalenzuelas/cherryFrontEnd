// Libs
import { type FC, type MouseEvent } from 'react'

// Components |  State
import { type DanceClass } from '@state'
import { Button } from '@nextui-org/react'
import styles from './styles.module.css'

interface Props {
  dayOfMonth: number
  classesByDay: DanceClass[]
  handleClick: (e: MouseEvent<HTMLButtonElement>, day: number) => void
}

export const DesktopReadableClassButtons: FC<Props> = ({ dayOfMonth, classesByDay, handleClick }) => {
  return (<>
    {classesByDay.map(danceClass => <Button
      key={danceClass.id}
      onClick={e => { handleClick(e, dayOfMonth) }}
      size='sm'
      radius='sm'
      name='readable'
      className={styles.class} >
      {danceClass.gender}
    </Button>)}
  </>)
}
