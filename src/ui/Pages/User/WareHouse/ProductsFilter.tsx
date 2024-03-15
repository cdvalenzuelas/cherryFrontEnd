import { type Product, useProductsState } from '@/state'
import { Input, Checkbox, CheckboxGroup } from '@nextui-org/react'
import { type ChangeEvent, useState, type FC, useEffect } from 'react'

interface Props {
  getProducts: (products: Product[]) => void
}

export const ProductsFilter: FC<Props> = ({ getProducts }) => {
  const products = useProductsState(state => state.products)

  products.sort((a, b) => a.selling_price - b.selling_price)

  const [search, setSearch] = useState<string>('')
  const [filters, setFilters] = useState<string[]>(['no'])

  // Botones de búsqueda usuarios y estilo
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setSearch(value)
  }

  useEffect(() => {
    const thereAreThreeChar = search.length > 3

    let internalProducts: Product[] = products

    if (thereAreThreeChar) {
      internalProducts = internalProducts.filter(product => product.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (filters.includes('yes') && !filters.includes('no')) {
      internalProducts = internalProducts.filter(product => product.quantity === 0)
    } else if (filters.includes('no') && !filters.includes('yes')) {
      internalProducts = internalProducts.filter(product => product.quantity !== 0)
    }

    getProducts(internalProducts)
  }, [filters, search, products])

  return <div
    style={{ backgroundColor: 'white' }}
    className='w-screen px-5 py-3 shadow-md fixed z-10'
  >

    <Input
      label='Buscar Producto'
      placeholder="Propucto"
      size='md'
      variant='bordered'
      color='secondary'
      value={search}
      onChange={handleChange}
      className='mb-2 mt-2'
    />

    <div className='flex gap-2 mb-2'>
      <CheckboxGroup
        orientation="horizontal"
        color="secondary"
        className='flex justify-between'
        value={filters}
        onValueChange={setFilters}
      >
        <Checkbox value='no'>En Existencia</Checkbox>
        <Checkbox value='yes'>Agotado</Checkbox>
      </CheckboxGroup>
    </div>

  </div>
}
