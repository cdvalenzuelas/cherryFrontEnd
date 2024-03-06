// Libs
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, User as UserAvatar, Input } from '@nextui-org/react'
import { useState, type Dispatch, type FC, type MouseEvent, type SetStateAction, type ChangeEvent } from 'react'
import style from './styles.module.css'

import { createPayment } from '@/api'
import { usePaymentsState, type User, type Payment } from '@/state'

interface Props {
  isOpen: boolean
  handleOpen: (e: MouseEvent<HTMLButtonElement>, teacher: User | null) => void
  setIsOpen: Dispatch<SetStateAction<boolean>>
  teacher: User | null
  paymentsByTeacher: Payment[]
}

export const NewSaleModal: FC<Props> = ({ isOpen, handleOpen, setIsOpen, teacher, paymentsByTeacher }) => {
  const addPaymnet = usePaymentsState(state => state.addPaymnet)

  const [amount, setAmount] = useState<number>(0)
  const [description, setDescription] = useState<string>('')

  // Manejar el agregar y eliminar usuarios
  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    const newPayment = {
      teacher: teacher?.id as string,
      date: new Date(),
      amount,
      description,
      image: ''
    }

    const [paymentCreated] = await createPayment(newPayment)

    addPaymnet(paymentCreated)

    setIsOpen(false)
  }

  // Modificación de precio y estilo
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as 'amount' | 'description'
    const value = e.currentTarget.value

    if (name === 'amount') {
      setAmount(Number(value))
    }

    if (name === 'description') {
      setDescription(value)
    }
  }

  return (<Modal placement='center' isOpen={isOpen} size='lg' backdrop='blur' className={style.form}>
    <ModalContent>

      <ModalHeader className='flex flex-col gap-5 items-start'>
        <h3>Registrar Pagos</h3>

        <UserAvatar
          name={teacher?.name}
          description={teacher?.instagram_id}
          avatarProps={{
            src: teacher?.image,
            size: 'md',
            isBordered: true,
            color: 'secondary'
          }}
        />
      </ModalHeader>

      <ModalBody>

        <Input
          variant='bordered'
          color='secondary'
          type='number'
          label="Monto"
          placeholder="El estilo de la clase"
          name='amount'
          autoComplete='off'
          onChange={handleChange}
          value={String(amount)}
        />

        <Input
          variant='bordered'
          color='secondary'
          type="text"
          label="Descripción"
          placeholder="Descripción del pago"
          name='description'
          autoComplete='off'
          onChange={handleChange}
          value={description}
        />

      </ModalBody>

      <ModalFooter>
        <Button name='close' size='sm' color='danger' variant='ghost' onClick={e => { handleOpen(e, teacher) }}>Cerrar</Button>
        <Button size='sm' color='primary' onClick={handleSubmit}>Crear</Button>
      </ModalFooter>

    </ModalContent>
  </Modal>)
}
