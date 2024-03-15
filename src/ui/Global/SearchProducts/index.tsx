import { type Product, useProductsState } from '@state'
import { Input, Button, Card, Divider, Chip } from '@nextui-org/react'
import { useState, type ChangeEvent, type MouseEvent, type FC, useEffect } from 'react'
import styles from './styles.module.css'
import { formatCurency } from '@/utils/currency'
import { QuantityController } from './QuantityController'
import Image from 'next/image'

interface Summary {
  product_id: string
  invoice: string
  quantity: number
  quantityFromDb: number
  price: number
  total: number
  profit: number
  discount: number
  purchase_price: number
}

interface Props {
  getSummary?: (summary: Summary[]) => void
}

export const SearchProducts: FC<Props> = ({ getSummary }) => {
  const products = useProductsState(state => state.products)

  const [search, setSearch] = useState<string>('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [summary, setSummary] = useState<Summary[]>([])

  useEffect(() => {
    if (getSummary !== undefined) {
      getSummary(summary)
    }
  }, [summary])

  // Botones de búsqueda usuarios y estilo
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setSearch(value)

    if (value.length > 3) {
      // Filtrar bien la busqueda
      const selectedProductsIds = selectedProducts.map(item => item.id)

      const internalProducts = products.filter(product => {
        const cond1 = product.quantity > 0
        const cond2 = product.name.toLowerCase().includes(value.toLowerCase())
        const cond3 = !selectedProductsIds.includes(product.id)

        return cond1 && cond2 && cond3
      }
      )
      setSearchResults(internalProducts.sort((a, b) => a.selling_price - b.selling_price))
    } else {
      setSearchResults([])
    }
  }

  // Manejar el agregar y eliminar usuarios
  const handleProduct = (e: MouseEvent<HTMLButtonElement>) => {
    const productId = e.currentTarget.value

    const selectedProduct = products.find(product => product.id === productId) as Product
    const newSearchResults = searchResults.filter(seachResult => seachResult.id !== selectedProduct.id)

    setSearch('')
    setSearchResults([])

    if (newSearchResults.length === 0) {
      setSearch('')
      setSearchResults([])
    }

    const newSelectedProducts = [...selectedProducts, selectedProduct]

    const internalSummary: Summary = {
      product_id: selectedProduct.id,
      quantity: 1,
      price: selectedProduct.selling_price,
      purchase_price: selectedProduct.purchase_price,
      total: selectedProduct.selling_price * (1 - selectedProduct.discount),
      profit: selectedProduct.selling_price * (1 - selectedProduct.discount) - selectedProduct.purchase_price,
      discount: selectedProduct.discount,
      quantityFromDb: selectedProduct.quantity,
      invoice: selectedProduct.invoice
    }

    setSummary([...summary, internalSummary])
    setSelectedProducts(newSelectedProducts)
  }

  // Manejar el agregar y eliminar usuarios
  const handleIncreaseDecrease = (e: MouseEvent<HTMLButtonElement>, producId: string) => {
    const name = e.currentTarget.name as 'more' | 'less'

    const filteredsummary = summary.find(item => item.product_id === producId) as Summary
    const notFilteredsummary = summary.filter(item => item.product_id !== producId)

    let internalQuantity = filteredsummary.quantity

    if (name === 'more') {
      internalQuantity = internalQuantity + 1
    } else {
      internalQuantity = internalQuantity - 1
    }

    const { price, discount, purchase_price: purchasePrice } = filteredsummary

    filteredsummary.quantity = internalQuantity
    filteredsummary.total = internalQuantity * price * (1 - discount)
    filteredsummary.profit = internalQuantity * (price * (1 - discount) - purchasePrice)

    // si la cantidad en 0 eliminarlo del sumario y del summary y de los elementos seleccionados
    if (internalQuantity === 0) {
      const internalSelectedProducts = selectedProducts.filter(item => item.id !== filteredsummary.product_id)
      setSelectedProducts(internalSelectedProducts)
      setSummary(notFilteredsummary)
    } else {
      setSummary([...notFilteredsummary, filteredsummary])
    }
  }

  return (
    <div className="relative">
      <Input
        color="secondary"
        variant="bordered"
        type="text"
        label="Productos"
        placeholder="Agregar Productos"
        className="relavite mb-2"
        name="estudiantes"
        autoComplete="off"
        onChange={handleChange}
        value={search}
      />

      {searchResults.length > 0 && (
        <Card className={styles.searchContainer}>
          {searchResults.map(product => (
            <Button
              key={product.id}
              value={product.id}
              variant="flat"
              size="sm"
              className="h-12 flex items-center justify-between px-5 gap-3"
              color="success"
              onClick={handleProduct}
              startContent={<>
                {(product.image !== null || product.image === "''") && <div
                  style={{ height: '2rem', width: '2rem' }}>
                  <Image
                    src={product.image}
                    alt='prodictImage'
                    width={100}
                    height={100}
                    style={{ height: '2rem', width: '2rem', borderRadius: '0.5rem' }}
                  />
                </div>}

                {product.image === null && <div
                  className='flex-shrink-0'
                  style={{ height: '2rem', width: '2rem', border: '2px solid var(--blue2)', borderRadius: '0.5rem' }}>
                  <Image
                    src='/image_placeholder.png'
                    alt='prodictImage'
                    width={100}
                    height={100}
                    style={{ height: '2rem', width: '2rem', borderRadius: '0.5rem' }}
                  />
                </div>}
              </>}
            >
              <span className='flex-grow flex justify-start overflow-hidden whitespace-nowrap'>{product.name}</span>
              <span className='flex-shrink-0' style={{ fontWeight: 'bold' }}>$ {formatCurency(product.selling_price)}</span>
            </Button>
          ))}
        </Card>
      )}

      {selectedProducts.length > 0 && <Divider />}

      {selectedProducts.map((product) => {
        const { quantity } = summary.find(item => item.product_id === product.id) as Summary

        return (<>

          <div key={product.id} className="flex py-1 px-1 h-max mt-3" style={{ fontSize: '0.8rem' }}>
            <div className="flex flex-row items-center justify-between align-middle py-1 w-full gap-3">

              <QuantityController quantity={quantity} product={product} handleIncreaseDecrease={handleIncreaseDecrease} />

              <div className='flex-grow text-left flex gap-2 items-center h-full'>
                <b>({quantity})</b>
                <div className='flex-shrink flex flex-col'>
                  <span>{product.name}</span>
                  <Chip size='sm' variant='flat' color='warning'>{product.area}</Chip>
                </div>
              </div>

              <div className='flex flex-col items-end justify-end flex-shrink-0'>
                <span style={{ color: 'var(--success)' }}>({quantity} x $ {formatCurency(product.selling_price)})</span>
                <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>$ {formatCurency(product.selling_price * quantity)}</span>
              </div>

            </div>
          </div>

          <Divider />
        </>
        )
      })}

    </div>
  )
}
