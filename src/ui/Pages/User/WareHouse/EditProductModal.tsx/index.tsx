/* eslint-disable @typescript-eslint/no-unused-vars */
// Libs
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Chip, Divider, Snippet } from '@nextui-org/react'
import { useState, type Dispatch, type FC, type MouseEvent, type SetStateAction } from 'react'
import style from './styles.module.css'

import { SearchProducts } from '@/ui/Global/SearchProducts'
import { useEditProductModal } from './useEditProductModal'
import { formatCurency } from '@/utils/currency'
import type { Product } from '@/state'
import Image from 'next/image'
import { Canvas } from '../Canvas'

import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Props {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  product: Product | null
}

export const EditProductModal: FC<Props> = ({ isOpen, setIsOpen, product }) => {
  const [display, setDisplay] = useState<boolean>(false)

  if (product === null) {
    return null
  }

  const imageIsNull = product.image === null || product.image === "''"

  return (
    <>
      {display && <Canvas productId={product.id} setDisplay={setDisplay} productImage={product.image} />}

      <Modal
        placement='bottom-center'
        isOpen={isOpen}
        size="lg"
        backdrop="blur"
        className={style.form}
        style={{ padding: '2rem' }}
      >
        <ModalContent>

          <ModalHeader className='flex gap-4 items-center justify-start'>

            {!imageIsNull && <div
              style={{ height: '5rem', width: '5rem' }}
              className='flex-shrink-0 relative'>

              <Image
                src={product.image}
                alt='prodictImage'
                width={100}
                height={100}
                style={{ borderRadius: '0.5rem' }}
              />

              <Button
                size='sm'
                isIconOnly
                startContent={<FontAwesomeIcon icon={faCamera} color='#fff' />}
                color='danger'
                className='absolute top-0 right-0 -translate-y-1/2 -translate-x-1/2'
                onClick={e => { setDisplay(true) }}
              />

            </div>}

            {imageIsNull && <div
              style={{ height: '5rem', width: '5rem', border: '2px solid var(--blue2)', borderRadius: '0.5rem', backgroundColor: 'var(--gray1)' }}
              className='flex-shrink-0 relative'>

              <Image
                src='/image_placeholder.png'
                alt='prodictImage'
                width={100}
                height={100}
                style={{ height: '5rem', width: '5rem', borderRadius: '0.5rem' }}
              />

              <Button
                size='sm'
                isIconOnly
                startContent={<FontAwesomeIcon icon={faCamera} color='#fff' />}
                color='danger'
                className='absolute top-0 right-0 -translate-y-1/2 -translate-x-1/2'
                onClick={e => { setDisplay(true) }}
              />

            </div>}

            <div className='flex flex-col gap-2'>

              <div className='flex gap-2 items-start justify-start'>
                <span style={{ color: 'var(--success)', fontWeight: 'bold' }} >{product.invoice}</span>
                <span style={{ color: 'var(--warning)', fontWeight: 'bold' }} >{product.reference}</span>
              </div>

              <div className='flex gap-2 items-start justify-start'>
                <Chip size='sm' variant='flat' color='success'>{product.area}</Chip>
                {product.type.map(item => <Chip key={item} size='sm' variant='flat' color='warning'>{item}</Chip>)}
              </div>

            </div>

          </ModalHeader>

          <Divider />

          <ModalBody className='flex flex-row justify-start items-start gap-4 w-full'>

            <div className='flex flex-col gap-2 w-full'>

              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{product.name}</span>

              {product.quantity > 1 && <span style={{ color: 'var(--success)' }}><b>{product.quantity}</b> unidades disponibles</span>}
              {product.quantity <= 0 && <span style={{ color: 'var(--danger)' }}>Agotado</span>}
              {product.quantity === 1 && <span style={{ color: 'var(--warning)' }}>Una <b>(1)</b> unidad disponible</span>}

              <Button
                className='flex flex-row w-full items-center justify-between px-5 py-3 mt-2'
                color='success'
                variant='flat'
                disabled={true}
              >
                <span><b>P. de venta:</b> $ {formatCurency(product.selling_price)}</span>
                <span><b>P. de compra:</b> $ {formatCurency(product.purchase_price)}</span>
              </Button>

            </div>

          </ModalBody>

          <Divider />

          <ModalFooter>
            <Button
              name="close"
              size="sm"
              color="danger"
              variant="ghost"
              onClick={e => { setIsOpen(false) }}
            >
              Cerrar
            </Button>
            {/* <Button size="sm" color="primary" onClick={handleSubmit}>
            Crear
          </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
