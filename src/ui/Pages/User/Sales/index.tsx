// Lib
import { useState, type MouseEvent } from 'react'
import { Button, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import styles from './styles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import { Products } from './Products'
import { Invoices } from './Invoices'

type SalesStage = 'invoices' | 'products'

export const Sales = () => {
  const [popoverIsOpnen, setPopoverIsOpnen] = useState<boolean>(false)
  const [salesStage, setSalesStage] = useState<SalesStage>('products')
  const [isOpen, setIsOpen] = useState<boolean>(false)

  console.log('hola')

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name as SalesStage

    if (name === 'products') {
      setIsOpen(true)
    }

    if (name === 'invoices') {
      setIsOpen(false)
    }

    setSalesStage(name)
    setPopoverIsOpnen(false)
  }

  return (
    <>
      {salesStage === 'products' && <Products isOpen={isOpen} setIsOpen={setIsOpen} />}
      {salesStage === 'invoices' && <Invoices />}

      <Popover
        onClick={(e) => {
          setPopoverIsOpnen(false)
        }}
        isOpen={popoverIsOpnen}
        defaultOpen={false}
        triggerType="listbox"
        backdrop="opaque"
        placement="top-end"
        offset={40}
        classNames={{
          content: [styles.popoverContent]
        }}
      >
        <PopoverTrigger>
          <Button
            size="lg"
            color="primary"
            className={styles.newSale}
            variant="shadow"
            isIconOnly
            onClick={(e) => {
              setPopoverIsOpnen(true)
            }}
            radius="full"
            startContent={
              <FontAwesomeIcon icon={faPlus} style={{ color: '#fff' }} />
            }
            name="open"
          />
        </PopoverTrigger>

        <PopoverContent>

          <div className="flex flex-col items-end">

            <Button
              size="lg"
              className={styles.popoverButton}
              name="invoices"

              onClick={handleClick}
            >
              Facturas <div className={styles.icon}>📄</div>
            </Button>

            <Button
              size="lg"
              className={styles.popoverButton}
              name="products"
              onClick={handleClick}
            >
              Ventas <div className={styles.icon}>💄</div>
            </Button>

          </div>

        </PopoverContent>
      </Popover>
    </>
  )
}
