import { Product } from "@/state"
import { Button, Chip } from "@nextui-org/react"
import { Dispatch, FC, SetStateAction } from "react"

interface Props {
  products: Product[]
  setProducts: Dispatch<SetStateAction<Product[]>>
}

export const AddProducts: FC<Props> = ({ products, setProducts }) => {

  return <ul className="w-full flex flex-col items-center justify-center gap-2 px-5" style={{ marginTop: '2rem' }}>
    {products.map(product => {
      return <Button
        className="w-full px-5 py-3 h-fit"
        variant="flat"
        color='success'
        key={product.id}>
        <div className="flex flex-col gap-2 items-start justify-start w-full">

          <div className="flex flex-row items-center justify-between w-full">
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{product.name}</span>
            <span><b>{product.quantity}</b> unidades</span>
          </div>

          <div className="flex felx-row items-center justify-start gap-2">
            <Chip color='warning' size="sm">P. Compra: {product.purchase_price}</Chip>
            <Chip color='success' size="sm">P. Venta: {product.selling_price}</Chip>
          </div>

          <div className="flex felx-row items-center justify-start gap-2">
            <Chip color='primary' size='sm'>{product.area}</Chip>
            {product.type.map(item => <Chip key={item} color='secondary' size="sm">P. Compra: {product.purchase_price}</Chip>)}
          </div>

        </div>
      </Button>
    })}
  </ul>
}