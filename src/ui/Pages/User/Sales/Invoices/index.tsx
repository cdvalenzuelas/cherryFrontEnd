/* eslint-disable @typescript-eslint/no-unused-vars */
import { type MouseEvent, useState, useEffect } from 'react'
import { NewSaleModal } from './NewSaleModal'
import { Button, Chip } from '@nextui-org/react'
import { Invoice, Product, useInvoicesState, useProductsState } from '@/state'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faFloppyDisk, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Reports } from './Reports'
import { AddProducts } from './AddProducts'
import { NewInvoice } from './NewInvoice'
import { createInvoice } from '@/api'

type InvoiceStep = 'report' | 'newInvoice' | 'addProducts'

export const Invoices = () => {
  const invoices = useInvoicesState(state => state.invoices)
  const products = useProductsState(state => state.products)

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [invoice, setInvoice] = useState<Invoice>({
    id: 1,
    name: '',
    date: new Date(),
    reference: '',
    provider: '',
    total: 0,
    total_selling: 0,
    recovered_money: 0,
    owner: 'cristian'
  })

  const [invoiceStep, setInvoiceStep] = useState<InvoiceStep>('report')

  useEffect(() => {
    if (invoiceStep === 'report') {
      setInvoice({
        id: 1,
        name: '',
        date: new Date(),
        reference: '',
        provider: '',
        total: 0,
        total_selling: 0,
        recovered_money: 0,
        owner: 'cristian'
      })
      setNewProducts([])
    }
  }, [invoiceStep])

  invoices.sort((a, b) => (a.recovered_money / a.total) - (b.recovered_money / b.total))

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      const newInvoice = await createInvoice(invoice, newProducts)
      setInvoiceStep('report')
    } catch (error) {
      setInvoiceStep('report')
    }
  }

  return <>
    <header className='flex flex-col justify-start items-start w-full'>

      <div className='w-full flex flex-row items-center justify-between px-5'>
        {invoiceStep === 'report' && <h1>Facturas</h1>}
        {invoiceStep === 'newInvoice' && <h1>Factura</h1>}
        {invoiceStep === 'addProducts' && <h1>Productos</h1>}

        <div className='flex gap-2 items-center justify-between'>
          {invoiceStep === 'report' && <Button
            size='sm'
            color='success'
            onClick={e => { setInvoiceStep('newInvoice') }}>
            Nueva Factura
          </Button>}

          {invoiceStep === 'newInvoice' && <Button
            isDisabled={invoice.name === '' || invoice.provider === '' || invoice.reference === ''}
            size='sm'
            color='primary'
            onClick={e => { setInvoiceStep('addProducts') }}>
            Crear productos
          </Button>}

          {invoiceStep === 'addProducts' && <Button
            isIconOnly
            size='sm'
            color='primary'
            startContent={<FontAwesomeIcon icon={faPlus} color='#fff' />}
            onClick={e => { setIsOpen(true) }} />}

          {invoiceStep === 'addProducts' && <Button
            isDisabled={newProducts.length === 0}
            isIconOnly
            size='sm'
            color='success'
            startContent={<FontAwesomeIcon icon={faFloppyDisk} color='#fff' />}
            onClick={handleSubmit} />}

          {(invoiceStep === 'newInvoice' || invoiceStep === 'addProducts') && <Button
            isIconOnly
            size='sm'
            color='danger'
            startContent={<FontAwesomeIcon icon={faTrashCan} color='#fff' />}
            onClick={e => { setInvoiceStep('report') }} />}
        </div>

      </div>

      {(invoiceStep === 'newInvoice' || invoiceStep === 'addProducts') && <div className='flex flex-row items-center justify-start gap-2 px-5'>
        <Chip size='sm' color='warning'>P. Compra: {newProducts.reduce((a, b) => a + b.purchase_price, 0)}</Chip>
        <Chip size='sm' color='success'>P. Venta: {newProducts.reduce((a, b) => a + b.selling_price, 0)}</Chip>
        <Chip size='sm' color='secondary'>{newProducts.reduce((a, b) => a + b.quantity, 0)} unidades</Chip>
      </div>}

    </header>

    {invoiceStep === 'report' && <Reports
      invoices={invoices}
      products={products}
    />}

    {invoiceStep === 'newInvoice' && <NewInvoice
      invoice={invoice}
      setInvoice={setInvoice}
    />}

    {invoiceStep === 'addProducts' && <AddProducts
      products={newProducts}
      setProducts={setNewProducts}
    />}

    {isOpen && <NewSaleModal
      invoice={invoice}
      newProducts={newProducts}
      isOpen={true}
      setIsOpen={setIsOpen}
      setNewProducts={setNewProducts}
    />}
  </>
}
