/* eslint-disable @typescript-eslint/no-unused-vars */
// Libs
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from '@nextui-org/react'
import { type Dispatch, type FC, type MouseEvent, type SetStateAction } from 'react'
import style from './styles.module.css'

import { SearchProducts } from '@/ui/Global/SearchProducts'
import { useNewSaleModal } from './useNewSaleModal'
import { formatCurency } from '@/utils/currency'

interface Props {
  isOpen: boolean
  handleOpen: (e: MouseEvent<HTMLButtonElement>) => void
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const NewSaleModal: FC<Props> = ({ isOpen, handleOpen, setIsOpen }) => {
  const { handleDateChange, handleSubmit, getSummary, date, total, quantity } = useNewSaleModal(setIsOpen)

  return (
    <Modal
      placement='top-center'
      isOpen={isOpen}
      size="lg"
      backdrop="blur"
      className={style.form}
    >
      <ModalContent>
        <ModalHeader>Registrar Nueva Venta de Productos</ModalHeader>

        <ModalBody>
          <Input type="date" value={date} onChange={handleDateChange} />
          <SearchProducts getSummary={getSummary} />

          <div className='flex justify-between items-center h-full'>
            <span>Total</span>
            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>$ {formatCurency(total)}</span>
          </div>

          <div className='flex justify-between items-center h-full'>
            <span>Cantidad</span>
            <span>{quantity} Elementos</span>
          </div>

        </ModalBody>

        <ModalFooter>
          <Button
            name="close"
            size="sm"
            color="danger"
            variant="ghost"
            onClick={handleOpen}
          >
            Cerrar
          </Button>
          <Button size="sm" color="primary" onClick={handleSubmit}>
            Crear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
