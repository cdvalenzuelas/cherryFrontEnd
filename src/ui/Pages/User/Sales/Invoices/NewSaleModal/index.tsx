/* eslint-disable @typescript-eslint/no-unused-vars */
// Libs
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Card, CardBody, Chip } from '@nextui-org/react'
import { useState, type Dispatch, type FC, type MouseEvent, type SetStateAction, ChangeEvent } from 'react'
import style from './styles.module.css'
import { Invoice, Product, useProductsState } from '@/state'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


interface Props {
  invoice: Invoice
  newProducts: Product[]
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  setNewProducts: Dispatch<SetStateAction<Product[]>>
}

type Name = 'name' | 'reference' | 'quantity' | 'purchase_price' | 'selling_price' | 'area' | 'type'

export const NewSaleModal: FC<Props> = ({ isOpen, setIsOpen, setNewProducts, invoice, newProducts }) => {
  const stateProducts = useProductsState(state => state.products)

  const areas = [...new Set(stateProducts.map(item => item.area))]
  const types = [...new Set(stateProducts.map(item => item.type).flat())]

  const [searchArea, setSearchArea] = useState<string>('')
  const [searchedArea, setSearchedArea] = useState<string[]>([])
  const [searchType, setSearchType] = useState<string>('')
  const [searchedType, setSearchedType] = useState<string[]>([])
  const [product, setProduct] = useState<Product>(() => {

    const date = new Date()

    return {
      id: date.toLocaleTimeString(),
      name: '',
      invoice: invoice.name,
      selling_price: 0,
      purchase_price: 0,
      discount: 0,
      quantity: 0,
      area: '',
      type: [],
      image: "''",
      reference: '',
      created_at: date
    }
  })

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    setNewProducts([...newProducts, product])
    setIsOpen(false)
  }

  const handleArea = (e: MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name as 'select' | 'delete'
    const value = e.currentTarget.value.toUpperCase()

    if (name === 'select') {
      setSearchArea('')
      setProduct({
        ...product,
        area: value
      })
    }

    if (name === 'delete') {
      setSearchArea('')
      setProduct({
        ...product,
        area: ''
      })
    }

    setSearchedArea([])
  }

  const handleType = (e: MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name as 'select' | 'delete'
    const value = e.currentTarget.value.toUpperCase()

    if (name === 'select') {
      setSearchType('')
      setProduct({
        ...product,
        type: [...product.type, value]
      })
    }

    if (name === 'delete') {
      setSearchType('')
      setProduct({
        ...product,
        type: product.type.filter(item => item !== value)
      })
    }

    setSearchedType([])
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as Name
    const value = e.currentTarget.value.toUpperCase()

    if (['name', 'reference'].includes(name)) {
      setProduct({ ...product, [name]: e.target.value.toUpperCase() })
    }

    if (['quantity', 'purchase_price', 'selling_price'].includes(name)) {
      setProduct({ ...product, [name]: Number(e.target.value) })
    }

    if (name === 'area') {
      setSearchArea(value)

      if (value.length > 3) {
        const internalAreas = areas.filter(area => area.includes(value))

        if (areas.includes(value)) {
          setSearchedArea(internalAreas)
        } else {
          setSearchedArea([...internalAreas, value])
        }
      } else {
        setSearchedArea([])
      }
    }

    if (name === 'type') {
      setSearchType(value)

      if (value.length > 3) {
        const internalAreas = types.filter(area => area.includes(value))

        if (types.includes(value)) {
          setSearchedType(internalAreas)
        } else {
          setSearchedType([...internalAreas, value])
        }
      } else {
        setSearchedType([])
      }
    }
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

          <Input
            autoComplete="off"
            size="sm"
            variant='bordered'
            color={product.name === '' ? 'danger' : 'secondary'}
            type="text"
            name='name'
            label="Nombre"
            placeholder="Nombre del producto"
            value={product.name}
            onChange={handleChange}
          />

          <Input
            autoComplete="off"
            size="sm"
            variant='bordered'
            color={product.purchase_price === 0 || product.selling_price <= product.purchase_price ? 'danger' : 'secondary'}
            type="number"
            name='purchase_price'
            label="Precio de compra"
            placeholder='0'
            value={String(product.purchase_price)}
            onChange={handleChange}
          />

          <Input
            autoComplete="off"
            type="number"
            size="sm"
            variant='bordered'
            color={product.selling_price === 0 || product.selling_price <= product.purchase_price ? 'danger' : 'secondary'}
            name='selling_price'
            label="Precio de venta"
            placeholder='0'
            value={String(product.selling_price)}
            onChange={handleChange}
          />

          <Input
            autoComplete="off"
            size="sm"
            variant='bordered'
            color={product.quantity === 0 ? 'danger' : 'secondary'}
            type="number"
            name='quantity'
            label="Cantidad"
            placeholder='0'
            value={String(product.quantity)}
            onChange={handleChange}
          />

          <Input
            autoComplete="off"
            size="sm"
            variant='bordered'
            color={product.reference === '' ? 'danger' : 'secondary'}
            type="text"
            name='reference'
            label="Referencia"
            placeholder='Referencia del Producto'
            value={String(product.reference)}
            onChange={handleChange}
          />

          <div className='relative'>

            <Input
              autoComplete="off"
              placeholder='Area'
              type='text'
              color={product.area === '' ? 'danger' : 'secondary'}
              variant='bordered'
              size='md'
              label='Area del Producto'
              value={searchArea}
              onChange={handleChange}
              name='area'
            />

            {searchedArea.length > 0 && <Card className='absolute z-20 flex flex-col w-full gap-2'>
              <CardBody className='flex flex-col gap-2'>
                {searchedArea.map(area => <Button
                  onClick={handleArea}
                  value={area}
                  color={areas.includes(area) ? 'success' : 'warning'}
                  name='select'
                  variant='flat'
                  className='flex justify-between'
                  endContent={!areas.includes(area)
                    ? <Chip color='warning' size='sm'>Nuevo</Chip>
                    : null}
                  key={area}>
                  {area}
                </Button>)}
              </CardBody>
            </Card>}

            {product.area !== '' && <Card className='absolute top-0 w-full z-20 px-5'>
              <CardBody className='flex flex-row justify-between items-center w-full'>
                <span>{product.area}</span>
                <Button
                  size='sm'
                  isIconOnly
                  color='danger'
                  name='delete'
                  onClick={handleArea}
                  startContent={<FontAwesomeIcon icon={faTrashCan} color='#fff' />} />
              </CardBody>
            </Card>}
          </div>


          <div className='relative'>

            <Input
              autoComplete="off"
              placeholder='Tipo de Producto'
              type='text'
              color={product.type.length === 0 ? 'danger' : 'secondary'}
              variant='bordered'
              size='md'
              label='Tipo de Producto'
              value={searchType}
              onChange={handleChange}
              name='type'
            />

            {searchedType.length > 0 && <Card className='absolute z-20 flex flex-col w-full gap-2'>
              <CardBody className='flex flex-col gap-2'>
                {searchedType.filter(type => !product.type.includes(type)).map(type => <Button
                  onClick={handleType}
                  value={type}
                  color={types.includes(type) ? 'success' : 'warning'}
                  name='select'
                  variant='flat'
                  className='flex justify-between'
                  endContent={!types.includes(type)
                    ? <Chip color='warning' size='sm'>Nuevo</Chip>
                    : null}
                  key={type}>
                  {type}
                </Button>)}
              </CardBody>
            </Card>}

            {product.type.length > 0 && <div className='py-3 mt-2 w-full z-10 flex gap-2 flex items-start justify-start flex-wrap'>
              {product.type.map(type => <Chip
                key={type}
                color='secondary'
                size='md'
                endContent={<Button
                  size='sm'
                  value={type}
                  isIconOnly
                  color='danger'
                  name='delete'
                  className='scale-50'
                  onClick={handleType}
                  startContent={<FontAwesomeIcon icon={faTrashCan} color='#fff' />} />}>
                {type}
              </Chip>)}
            </div>}
          </div>

        </ModalBody>

        <ModalFooter>

          <Button
            name="close"
            size="sm"
            color="danger"
            variant="ghost"
            onClick={e => { setIsOpen(false) }}
          >
            Cerrar
          </Button>

          <Button
            isDisabled={
              product.name === '' ||
              product.purchase_price === 0 ||
              product.selling_price === 0 ||
              product.quantity === 0 ||
              product.reference === '' ||
              product.area === '' ||
              product.type.length === 0 ||
              product.selling_price <= product.purchase_price
            }
            size="sm"
            color="primary"
            onClick={handleClick}
          >
            Crear
          </Button>

        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
