import { Button, Card, CardBody, Chip, Input, Select, SelectItem, Selection } from "@nextui-org/react"
import { type ChangeEvent, useState, type Dispatch, type FC, type MouseEvent, type SetStateAction, useEffect, MouseEventHandler } from 'react'
import { Invoice, useInvoicesState } from '@/state'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'

type InvoiceStage = 'invoice' | 'products'
type InvoiceStep = 'report' | 'newInvoice' | 'addProducts'

interface Props {
  invoice: Invoice
  setInvoice: Dispatch<SetStateAction<Invoice>>
}

export const NewInvoice: FC<Props> = ({ invoice, setInvoice }) => {
  const invoices = useInvoicesState(state => state.invoices)

  const [search, setSearch] = useState<string>('')
  const [searchedProviders, setSearchedProviders] = useState<string[]>([])
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
      setSearch(value)

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
      setInvoice({
        ...invoice,
        reference: value,
        name: `${invoice.provider} ${value}`
      })
    }
  }

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name as 'select' | 'delete'
    const value = e.currentTarget.value.toUpperCase()

    if (name === 'select') {
      setSearch('')
      setInvoice({
        ...invoice,
        provider: value,
        name: `${value} ${invoice.reference}`
      })
    }

    if (name === 'delete') {
      setSearch('')
      setInvoice({
        ...invoice,
        provider: '',
        name: ` ${invoice.reference}`
      })
    }

    setSearchedProviders([])
  }

  const handleOwner = (e: MouseEvent<HTMLLIElement>) => {
    const value = String(e.currentTarget.value) as 'cristian' | 'cherry'

    setInvoice({ ...invoice, owner: value })
  }

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInvoice({ ...invoice, date: new Date(value) })
    setDate(value)
  }

  return <div className="flex flex-col gap-3 mt-2 px-5">
    <div className='relative'>

      <Input
        autoComplete="off"
        placeholder='Proveedor'
        type='text'
        color={invoice.provider === '' ? 'danger' : 'secondary'}
        variant='bordered'
        size='md'
        label='Proveedor'
        value={search}
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

      {invoice.provider !== '' && <Card className='absolute top-0 w-full z-20 px-5'>
        <CardBody className='flex flex-row justify-between items-center w-full'>
          <span>{invoice.provider}</span>
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
      autoComplete="off"
      placeholder='Referencia'
      type='text'
      color={invoice.reference === '' ? 'danger' : 'secondary'}
      variant='bordered'
      size='md'
      label='Referencia'
      value={invoice.reference}
      name='reference'
      onChange={handleChange}
    />

    <Input
      autoComplete="off"
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
      <SelectItem key='cristian' value='cristian' onClick={handleOwner}>Cristian</SelectItem>
      <SelectItem key='cherry' value='cherry' onClick={handleOwner}>Cherry</SelectItem>
    </Select>
  </div>
}