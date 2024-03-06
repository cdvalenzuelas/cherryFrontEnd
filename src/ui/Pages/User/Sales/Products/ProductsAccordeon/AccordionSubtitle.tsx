import { type ProductSale } from '@/state'
import { formatCurency } from '@/utils/currency'
import { Chip } from '@nextui-org/react'
import { type FC } from 'react'

interface Props {
  saleByPeriod: ProductSale[]
}

export const AccordionSubtitle: FC<Props> = ({ saleByPeriod }) => {
  const sales = formatCurency(saleByPeriod.reduce((a, b) => a + b.total, 0))
  const profit = formatCurency(saleByPeriod.reduce((a, b) => a + b.profit, 0))

  return <div className='flex gap-2 items-center justify-start'>
    <Chip color='primary' size='sm'>$ {sales}</Chip>
    <Chip color='success' size='sm'>$ {profit}</Chip>
  </div>
}
