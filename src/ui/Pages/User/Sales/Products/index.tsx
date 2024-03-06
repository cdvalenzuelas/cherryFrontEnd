import type { Dispatch, FC, SetStateAction, MouseEvent } from 'react'
import { ProductsAccordeon } from './ProductsAccordeon'
import { NewSaleModal } from './NewSaleModal.tsx'

interface Props {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const Products: FC<Props> = ({ isOpen, setIsOpen }) => {
  // const sales = useSalesState(state => state.sales)
  const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name as 'open' | 'close'

    setIsOpen(name === 'open')
  }

  return <>
    <h1>Productos</h1>

    <ProductsAccordeon />

    {isOpen && <NewSaleModal
      isOpen={true}
      handleOpen={handleOpen}
      setIsOpen={setIsOpen}
    />}
  </>
}
