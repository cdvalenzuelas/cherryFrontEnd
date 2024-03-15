/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Dispatch, type FC, type SetStateAction, type MouseEvent, useEffect, useState } from 'react'
import { NewSaleModal } from './NewSaleModal'
import { type ProductSale } from '@/state/productSales.js'
import { Accordion, AccordionItem, Button, Card, CardBody, CardHeader, Divider, Progress } from '@nextui-org/react'
import { formatCurency } from '@/utils/currency'
import { useInvoicesState, useProductsState } from '@/state'
import Image from 'next/image'

interface Props {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const Invoices: FC<Props> = ({ isOpen, setIsOpen }) => {
  const invoices = useInvoicesState(state => state.invoices)
  const products = useProductsState(state => state.products)

  invoices.sort((a, b) => (a.recovered_money / a.total) - (b.recovered_money / b.total))

  // const sales = useSalesState(state => state.sales)
  const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name as 'open' | 'close'

    setIsOpen(name === 'open')
  }

  return <>
    <h1>Facturas</h1>

    <ul className='flex flex-col gap-3 px-5' style={{ marginBottom: '7rem' }}>
      {invoices.map(invoice => {
        const progress = 100 * invoice.recovered_money / invoice.total
        const internalProducts = products.filter(product => product.invoice === invoice.name)
        internalProducts.sort((a, b) => a.selling_price - b.selling_price)

        return <Card key={invoice.id} className='px-5 py-3'>
          <CardHeader className='flex items-center justify-between'>
            <span style={{ fontWeight: 'bolder', color: 'var(--success)' }}>{invoice.provider}</span>
            <span style={{ fontWeight: 'bolder', color: 'var(--warning)' }}>{invoice.reference}</span>
          </CardHeader>

          <CardBody className='flex flex-col gap-3'>

            <div className='flex items-center justify-between'>
              <span>$ {formatCurency(invoice.total)}</span>
              <span>$ {formatCurency(invoice.recovered_money)}</span>
              <span
                style={{ fontWeight: 'bolder', color: progress < 100 ? 'var(--danger)' : 'var(--success)' }}>
                $ {formatCurency(invoice.recovered_money - invoice.total)}
              </span>
            </div>

            <Progress
              size='sm'
              color={progress < 100 ? 'warning' : 'success'}
              aria-label="Loading..."
              value={progress}
              className="max-w-md"
            />

            <Accordion>
              <AccordionItem title='Productos'>
                {internalProducts.map(product => {
                  const imageIsNull = product.image === null || product.image === "''"

                  return <Button
                    variant='light'
                    key={product.id}
                    color={product.quantity > 0 ? 'success' : 'warning'}
                    className='w-full flex h-fit py-3 px-0 gap-3 items-center justify-start'
                    style={{ backgroundColor: 'transparent' }}
                  >
                    {!imageIsNull && <div
                      style={{ height: '3rem', width: '3rem' }}
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
                      style={{ height: '3rem', width: '3rem', border: '1px solid var(--blue2)', borderRadius: '0.5rem', backgroundColor: 'var(--gray1)' }}
                      className='flex-shrink-0'>
                      <Image
                        src='/image_placeholder.png'
                        alt='prodictImage'
                        width={100}
                        height={100}
                        style={{ height: '3rem', width: '3rem', borderRadius: '0.5rem' }}
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
                })}
              </AccordionItem>
            </Accordion>

          </CardBody>

        </Card>
      })}
    </ul>

    {isOpen && <NewSaleModal
      isOpen={true}
      handleOpen={handleOpen}
      setIsOpen={setIsOpen}
    />}
  </>
}
