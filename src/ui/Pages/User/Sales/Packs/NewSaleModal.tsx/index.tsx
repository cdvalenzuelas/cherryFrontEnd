// Libs
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem, Input, Divider, Textarea, Chip, Avatar, Card, CardBody, Snippet } from '@nextui-org/react'
import type { Dispatch, FC, MouseEvent, SetStateAction } from 'react'

// Components
import { useNewSaleModal } from './useNewSaleModal'
import { SearchUser } from '@/ui/Global/SearchUser'
import { paymentModes, duaration } from '../../utils'
import { formatCurency } from '@/utils/currency'
import { userColor } from '@/utils/users'
import styles from './styles.module.css'

interface Props {
  isOpen: boolean
  handleOpen: (e: MouseEvent<HTMLButtonElement>) => void
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const NewSaleModal: FC<Props> = ({ isOpen, handleOpen, setIsOpen }) => {
  const {
    handles: { handSelect, handleSubmit, handleChange },
    packs,
    startDateMessage,
    internalSale,
    pack,
    getUser,
    promotion,
    courtesPackId,
    user,
    referralCode,
    referralUser
  } = useNewSaleModal({ setIsOpen })

  return (<Modal placement='center' isOpen={isOpen} size='lg' backdrop='blur' className='px-5 py-3'>
    <ModalContent>

      <ModalHeader>
        Registrar Nueva Venta
      </ModalHeader>

      <ModalBody>

        {courtesPackId !== '' && <Chip color='danger' variant='flat' size='sm'>El usurio ya ha tedido clase de cortesía</Chip>}

        <SearchUser
          getSelectedUser={getUser}
        />

        {user !== null && user.reward > 0 && <div>

          <span style={{ color: 'var(--blue2)' }}>Recompensa acumulada</span>

          <Snippet
            hideSymbol
            hideCopyButton
            color='secondary'
            size='md' className='flex items-center h-12'>
            {`$ ${formatCurency(user.reward)}`}
          </Snippet>

        </div>}

        <div className='flex gap-5'>
          {packs.length > 0 && <Select
            isRequired
            label='Plan'
            items={packs}
            placeholder='Seleccione el Plan'
            size='sm'
            defaultSelectedKeys={[packs[0].id]}
            variant='bordered'
            color='secondary'
            disabledKeys={[courtesPackId]}
          >
            {packs.map(pack => <SelectItem
              color='secondary'
              key={pack.id}
              onClick={e => { handSelect(e, 'pack') }}
            >
              {pack.name}
            </SelectItem>
            )}
          </Select>}

          <Select
            isRequired
            label='Método de Pago'
            items={paymentModes}
            placeholder='Seleccione el Método de Pago'
            size='sm'
            defaultSelectedKeys={['chash']}
            variant='bordered'
            color='secondary'
          >
            {paymentModes.map(item => <SelectItem color='secondary' key={item} onClick={e => { handSelect(e, 'paymentMode') }}>{item}</SelectItem>)}
          </Select>

        </div>

        {user !== null && (user.active_plan === null || user.active_plan.name === 'cortesia') && pack.name !== 'cortesia' && <div className={styles.referralContainer}>
          {packs.length > 0 && <Input
            label='Código de referidos'
            placeholder={user.referral_code}
            size='sm'
            variant='bordered'
            color='secondary'
            onChange={handleChange}
            className={styles.code}
            value={referralCode}
          />}

          {referralUser !== null && <Card className={styles.referralUser}>
            <CardBody className='flex flex-row items-center justify-between px-5 py-3'>
              <Avatar
                src={referralUser.image}
                isBordered size='sm'
                color={userColor(referralUser)}
              />
              <span>{referralUser.name}</span>
            </CardBody>
          </Card>}

        </div>}

        <Divider />

        {promotion !== '' && <Textarea
          isReadOnly
          color='warning'
          value={promotion}
          type="text"
          label="Promoción"
          size='sm'
          variant='flat'
        />}

        <div className='flex flex-col gap-2 mt-2 mb-2'>

          <Input
            isReadOnly
            color='success'
            value={duaration(pack.classes, pack.duration, pack.period)}
            type="text"
            label="Clases / Duración"
            size='sm'
            variant='flat'
            autoComplete='off'
          />

          <div className='flex gap-2'>

            {promotion !== '' && <Input
              isReadOnly
              color='danger'
              value={`$ ${formatCurency(internalSale.price)}`}
              autoComplete='off'
              type="text"
              label="Precio normal"
              size='sm'
            />}

            <Input
              autoComplete='off'
              isReadOnly
              color='success'
              value={`$ ${formatCurency(internalSale.total_price)}`}
              type="text"
              label="Total a Pagar"
              size='sm'
            />

          </div>

        </div>

        <Divider />

        {pack.period !== 'day' && <span>
          {`Puedes empezar tus clases hoy, recuerda que tu plan se aciva automáticamente el ${startDateMessage}.`}
        </span>}

      </ModalBody>

      <ModalFooter>
        <Button name='close' size='sm' color='danger' variant='ghost' onClick={handleOpen}>Cerrar</Button>
        <Button
          size='sm'
          color='primary'
          onClick={handleSubmit}
          isDisabled={internalSale.user_id === '' || (courtesPackId !== '' && pack.id === courtesPackId)}
        >Crear
        </Button>
      </ModalFooter>

    </ModalContent>
  </Modal>)
}
