import type { Product } from '@/state'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '@nextui-org/react'
import Image from 'next/image'
import type { FC, MouseEvent } from 'react'

interface Props {
  quantity: number
  product: Product
  handleIncreaseDecrease: (e: MouseEvent<HTMLButtonElement>, producId: string) => void
}

export const QuantityController: FC<Props> = ({ quantity, product, handleIncreaseDecrease }) => {
  return <div className='flex gap-2 items-center justify-start flex-grow-0 flex-shrink'>
    <div className='flex flex-col items-center justify-start gap-1'>

      <Button
        isIconOnly
        size="sm"
        color="secondary"
        radius='none'
        name="more"
        onClick={(e) => {
          handleIncreaseDecrease(e, product.id)
        }}
        isDisabled={quantity === product.quantity}
        startContent={<FontAwesomeIcon icon={faPlus} />}
      />

      <Button
        isIconOnly
        size="sm"
        color="secondary"
        radius='none'
        name="less"
        onClick={(e) => {
          handleIncreaseDecrease(e, product.id)
        }}
        isDisabled={quantity === 0}
        startContent={<FontAwesomeIcon icon={faMinus} />}
      />
    </div>

    {product.image !== null && <div style={{ height: '4rem', width: '4rem' }}>
      <Image
        src={product.image}
        alt='prodictImage'
        width={100}
        height={100}
        style={{ height: '4rem', width: '4rem', borderRadius: '0.5rem' }}
      />
    </div>}

    {product.image === null && <div style={{ height: '4rem', width: '4rem', border: '2px solid var(--blue2)', borderRadius: '0.5rem' }}>
      <Image
        src='/image_placeholder.png'
        alt='prodictImage'
        width={100}
        height={100}
        style={{ height: '4rem', width: '4rem', borderRadius: '0.5rem' }}
      />
    </div>}

  </div>
}
