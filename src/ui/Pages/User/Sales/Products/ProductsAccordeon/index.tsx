import { Accordion, AccordionItem, Divider, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import styles from '../../styles.module.css'

import { useEffect, useState } from 'react'
import { getProductSales, getProducts } from '@/api'
import { type ProductSale, useProductSalesState, useProductsState, type Product } from '@/state'
import { AccordionSubtitle } from './AccordionSubtitle'
import { createPopulateProductSales, createKey } from './utils'

type SummaryByPeriod = Record<string, Product[]>
type InternalSalesFromDB = Record<string, ProductSale[]>

export const ProductsAccordeon = () => {
  const salesFromDB = useProductSalesState(state => state.productSales)
  const setSalesFromDB = useProductSalesState(state => state.setProductSales)
  const products = useProductsState(state => state.products)
  const setProducts = useProductsState(state => state.setProducts)

  const [sales, setSales] = useState<InternalSalesFromDB>({})
  const [summaryByPeriod, setSummaryByPeriod] = useState<SummaryByPeriod>({})

  useEffect(() => {
    (async () => {
      const productSales = await getProductSales()
      const products = await getProducts()

      setProducts(products)
      setSalesFromDB(productSales)
    })()
  }, [])

  useEffect(() => {
    const internalSalesFromDB: InternalSalesFromDB = {}
    const internalSummaryByPeriod: SummaryByPeriod = {}
    const keys: string[] = []

    salesFromDB.forEach(saleFromDB => {
      const key = createKey(saleFromDB)
      const populateSales = createPopulateProductSales(saleFromDB, products)

      // Crear las ventas por periodo
      if (keys.includes(key)) {
        const productsInPeriod = internalSummaryByPeriod[key]
        const productIdsInPeiod = productsInPeriod.map(productInPeriod => productInPeriod.id)

        populateSales.forEach(populateSale => {
          // si ya esta en el summary sumar las cantidades
          if (productIdsInPeiod.includes(populateSale.id)) {
            const productToModify = productsInPeriod.filter(productInPeriod => productInPeriod.id === populateSale.id)[0]
            const productsToNoModify = productsInPeriod.filter(productInPeriod => productInPeriod.id !== populateSale.id)

            productToModify.quantity = productToModify.quantity + populateSale.quantity

            internalSummaryByPeriod[key] = [...productsToNoModify, productToModify]
          } else {
            internalSummaryByPeriod[key] = [...internalSummaryByPeriod[key], populateSale]
          }
        })

        internalSalesFromDB[key] = [...internalSalesFromDB[key], saleFromDB]
      } else {
        keys.push(key)
        internalSalesFromDB[key] = [saleFromDB]
        internalSummaryByPeriod[key] = populateSales
      }
    })

    setSales(internalSalesFromDB)
    setSummaryByPeriod(internalSummaryByPeriod)
  }, [salesFromDB, products])

  return <Accordion defaultExpandedKeys={[]} className={styles.accordion} variant='shadow'>
    {Object.keys(summaryByPeriod).map(period => (

      <AccordionItem
        title={period}
        key={period}
        subtitle={<AccordionSubtitle saleByPeriod={sales[period]} />}
      >
        <Divider />

        <Table removeWrapper selectionMode='single' color='secondary' aria-label="Example table with dynamic content">

          <TableHeader>
            <TableColumn>Nombre</TableColumn>
            <TableColumn>Cantidad</TableColumn>
          </TableHeader>

          <TableBody>
            {summaryByPeriod[period].map(product => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>

      </AccordionItem>

    ))}

  </Accordion>
}
