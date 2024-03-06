import { type FC, type MouseEvent } from 'react'
import { Button, Modal, ModalContent, ModalFooter } from '@nextui-org/react'
import { Info } from '../EditableModal/Info'
import styles from '../styles.module.css'
import { type DanceClass } from '@/state'

interface Props {
  dayOfMonth: number
  month: number
  year: number
  handleClick: (e: MouseEvent<HTMLButtonElement>, day: number) => void
  danceClass: DanceClass
}

export const ReadableModal: FC<Props> = ({ dayOfMonth, month, year, handleClick, danceClass }) => {
  return <Modal isOpen={true} backdrop='blur' className={styles.readableModal} placement='center'>
    <ModalContent >

      <Info danceClass={danceClass} dayOfMonth={dayOfMonth} month={month} year={year} editable={false} />

      <ModalFooter>
        <Button color="danger" variant="flat" name='readable' onClick={e => { handleClick(e, dayOfMonth) }}>
          Cerrar
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
}
