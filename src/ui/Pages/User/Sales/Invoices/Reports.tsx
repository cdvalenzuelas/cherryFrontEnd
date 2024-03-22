import { Invoice, Product } from "@/state"
import { formatCurency } from "@/utils/currency"
import { Accordion, AccordionItem, Button, Card, CardBody, CardHeader, Progress } from "@nextui-org/react"
import { FC } from "react"
import Image from 'next/image'

interface Props {
  invoices: Invoice[]
  products: Product[]
}

export const Reports: FC<Props> = ({ invoices, products }) => { 
  return <ul className='flex flex-col gap-3 px-5' style={{ marginBottom: '7rem' }}>
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
}