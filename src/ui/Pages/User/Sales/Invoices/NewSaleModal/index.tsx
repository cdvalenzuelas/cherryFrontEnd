/* eslint-disable @typescript-eslint/no-unused-vars */
// Libs
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Card, CardBody, Chip, Select, SelectItem, type Selection } from '@nextui-org/react'
import { type ChangeEvent, useState, type Dispatch, type FC, type MouseEvent, type SetStateAction } from 'react'
import style from './styles.module.css'
import { useInvoicesState } from '@/state'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'

interface Props {
  isOpen: boolean
  handleOpen: (e: MouseEvent<HTMLButtonElement>) => void
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const NewSaleModal: FC<Props> = ({ isOpen, handleOpen, setIsOpen }) => {
  const invoices = useInvoicesState(state => state.invoices)

  const [provider, setProvider] = useState<string>('')
  const [reference, setReference] = useState<string>('')
  const [searchedProviders, setSearchedProviders] = useState<string[]>([])
  const [selectedPrivider, setSelectedProvider] = useState<string | null>(null)
  const [date, setDate] = useState<string>(() => {
    const newDate = new Date()
    const month = newDate.getMonth() + 1 < 10 ? `0${newDate.getMonth() + 1}` : `${newDate.getMonth() + 1}`
    const day = newDate.getDate() < 10 ? `0${newDate.getDate()}` : `${newDate.getDate()}`

    return `${newDate.getFullYear()}-${month}-${day}`
  })
  const [owner, setOwner] = useState<Selection>(new Set(['cristian']))

  const providers = [...new Set(invoices.map(invoice => invoice.provider))]

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as 'provider' | 'date' | 'reference'
    const value = e.target.value.toUpperCase()

    if (name === 'provider') {
      setProvider(value)

      if (value.length > 3) {
        const internalProviders = providers.filter(provider => provider.includes(value))

        if (providers.includes(value)) {
          setSearchedProviders(internalProviders)
        } else {
          setSearchedProviders([...internalProviders, value])
        }
      } else {
        setSearchedProviders([])
      }
    }

    if (name === 'reference') {
      setReference(value)
    }
  }

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name as 'select' | 'delete'
    const value = e.currentTarget.value.toUpperCase()

    if (name === 'select') {
      setSelectedProvider(value)
    }

    if (name === 'delete') {
      setSelectedProvider(null)
    }

    setProvider('')
    setSearchedProviders([])
  }

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDate(value)
  }

  return (
    <Modal
      placement='top-center'
      isOpen={isOpen}
      size="lg"
      backdrop="blur"
      className={style.form}
    >
      <ModalContent>
        <ModalHeader>Registrar Nueva Factura</ModalHeader>

        <ModalBody className='flex flex-col'>

          <div className='relative'>

            <Input
              placeholder='Proveedor'
              type='text'
              color='secondary'
              variant='bordered'
              size='md'
              label='Proveedor'
              value={provider}
              onChange={handleChange}
              name='provider'
            />

            {searchedProviders.length > 0 && <Card className='absolute z-20 flex flex-col w-full gap-2'>
              <CardBody className='flex flex-col gap-2'>
                {searchedProviders.map(provider => <Button
                  onClick={handleClick}
                  value={provider}
                  color={providers.includes(provider) ? 'success' : 'warning'}
                  name='select'
                  variant='flat'
                  className='flex justify-between'
                  endContent={!providers.includes(provider)
                    ? <Chip color='warning' size='sm'>Nuevo</Chip>
                    : null}
                  key={provider}>
                  {provider}
                </Button>)}
              </CardBody>
            </Card>}

            {selectedPrivider !== null && <Card className='absolute top-0 w-full z-20 px-5'>
              <CardBody className='flex flex-row justify-between items-center w-full'>
                <span>{selectedPrivider}</span>
                <Button
                  size='sm'
                  isIconOnly
                  color='danger'
                  name='delete'
                  onClick={handleClick}
                  startContent={<FontAwesomeIcon icon={faTrashCan} color='#fff' />} />
              </CardBody>
            </Card>}
          </div>

          <Input
            placeholder='Referencia'
            type='text'
            color='secondary'
            variant='bordered'
            size='md'
            label='Referencia'
            value={reference}
            name='reference'
            onChange={handleChange}
          />

          <Input
            type="date"
            color='secondary'
            variant='bordered'
            value={date}
            onChange={handleDateChange}
          />

          <Select
            label="Propietario"
            placeholder="Propietario de la factura"
            selectionMode='single'
            color='secondary'
            variant='bordered'
            isRequired
            selectedKeys={owner}
            onSelectionChange={setOwner}
            defaultSelectedKeys={['cristian']}
          >
            <SelectItem key='cristian' value='cristian'>Cristian</SelectItem>
            <SelectItem key='cherry' value='cherry'>Cherry</SelectItem>
          </Select>

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
          {/* <Button size="sm" color="primary" onClick={handleSubmit}>
            Crear
          </Button> */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
