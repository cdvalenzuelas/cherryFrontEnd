import { formatCurency } from '@/utils/currency'
import { Button } from '@nextui-org/react'
import { type Product, useProductsState } from '@state'
import Image from 'next/image'
import { ProductsFilter } from './ProductsFilter'
import { EditProductModal } from './EditProductModal.tsx'
import { useState, type MouseEvent } from 'react'

export const WareHouse = () => {
  const products = useProductsState(state => state.products)

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const getProducts = (products: Product[]) => {
    setFilteredProducts(products)
  }

  const handleProduct = (e: MouseEvent<HTMLButtonElement>, product: Product) => {
    setIsOpen(true)
    setSelectedProduct(product)
  }

  return (<>
    <section className='flex flex-col items-center w-full'>

      <ProductsFilter getProducts={getProducts} />

      <ul className='flex flex-col gap-3 px-5 py-3 w-full' style={{ paddingTop: '10rem' }}>
        {filteredProducts.map(product => {
          const imageIsNull = product.image === null || product.image === "''"

          return <li key={product.id} className='w-full'>
            <Button
              variant='flat'
              color={product.quantity > 0 ? 'success' : 'warning'}
              className='w-full h-fit py-3 px-5 gap-3 items-center justify-start shadow-md'
              onClick={e => { handleProduct(e, product) }}
            >
              {!imageIsNull && <div
                style={{ height: '4rem', width: '4rem' }}
                className='flex-shrink-0'>
                <Image
                  src={product.image}
                  alt='prodictImage'
                  width={100}
                  height={100}
                  style={{ borderRadius: '0.5rem' }}
                />
              </div>}

              {imageIsNull && <div
                style={{ height: '4rem', width: '4rem', border: '2px solid var(--blue2)', borderRadius: '0.5rem', backgroundColor: 'var(--gray1)' }}
                className='flex-shrink-0'>
                <Image
                  src='/image_placeholder.png'
                  alt='prodictImage'
                  width={100}
                  height={100}
                  style={{ height: '4rem', width: '4rem', borderRadius: '0.5rem' }}
                />

              </div>}

              <div className='flex flex-col gap-2 items-start w-full overflow-hidden'>

                <span
                  style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  {product.name}
                </span>

                {product.quantity > 1 && <span>{product.quantity} unidades disponibles</span>}
                {product.quantity <= 0 && <span>Agotado</span>}
                {product.quantity === 1 && <span>Una (1) unidad disponible</span>}

                <span style={{ fontWeight: 'bold' }}>$ {formatCurency(product.selling_price)}</span>

              </div>

            </Button>
          </li>
        })}
      </ul>
    </section>

    <EditProductModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      product={selectedProduct}
    />

  </>)
}
