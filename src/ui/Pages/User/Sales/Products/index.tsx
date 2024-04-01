/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Dispatch, type FC, type SetStateAction, type MouseEvent, useEffect, useState } from 'react'
import { NewSaleModal } from './NewSaleModal.tsx'
import { getSales } from '@/api'
import { type ProductSale } from '@/state/productSales.js'
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react'
import { formatCurency } from '@/utils/currency'

interface Props {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const Products: FC<Props> = ({ isOpen, setIsOpen }) => {
  const [sales, setSales] = useState<ProductSale[]>([])

  useEffect(() => {
    (async () => {
      const internalSales = await getSales()
      setSales(internalSales)
    })()
  }, [])

  const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name as 'open' | 'close'

    setIsOpen(name === 'open')
  }

  return <>
    <h1>Ventas</h1>

    <ul className='flex flex-col gap-3 px-5'>
      {sales.map(sale => <Card key={sale.id} className='px-5 py-3'>
        <CardHeader className='flex flex-col items-start'>
          {String(sale.date).split('T')[0]}
          <Divider />
        </CardHeader>

        <CardBody className='flex flex-col gap-3'>
          {sale.summary.map(element => {
            return <div key={element.product_id} className='flex justify-between items-center h-full'>
              <span>{element.product_id}</span>
              <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>{element.product_id}</span>
              <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>{element.quantity}</span>
            </div>
          })}

          <Divider />

          <div className='flex justify-between items-center h-full'>
            <span>Total</span>
            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>$ {formatCurency(sale.total)}</span>
          </div>

          <div className='flex justify-between items-center h-full'>
            <span>Ganancia</span>
            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>$ {formatCurency(sale.profit)}</span>
          </div>

        </CardBody>

      </Card>)}
    </ul>

    {isOpen && <NewSaleModal
      isOpen={true}
      handleOpen={handleOpen}
      setIsOpen={setIsOpen}
    />}
  </>
}
