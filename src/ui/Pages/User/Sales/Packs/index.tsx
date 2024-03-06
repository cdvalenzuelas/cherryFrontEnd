import { SearchUser } from '@/ui/Global/SearchUser'
import { Card, CheckboxGroup, Checkbox, Divider } from '@nextui-org/react'
import { SaleAccordeon } from './SaleAccordeon'
import styles from '../styles.module.css'
import { useState, type MouseEvent, type FC, type Dispatch, type SetStateAction } from 'react'
import { NewSaleModal } from './NewSaleModal.tsx'

interface Props {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const Packs: FC<Props> = ({ isOpen, setIsOpen }) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const [filters, setFilters] = useState<string[]>(['vigente'])

  const getUserId = (userId: string | null) => {
    setSelectedUserId(userId)
  }

  // const sales = useSalesState(state => state.sales)
  const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name as 'open' | 'close'

    setIsOpen(name === 'open')
  }

  return <>

    <h1>Planes</h1>

    <Card className={styles.form}>

      <SearchUser showAllUsers={true} getUserId={getUserId} />

      <CheckboxGroup
        orientation="horizontal"
        color="secondary"
        className='flex justify-between'
        value={filters}
        onValueChange={setFilters}
      >
        <Checkbox value="vigente">vigente</Checkbox>
        <Checkbox value="vencido">vencido</Checkbox>
        <Checkbox value="cortesia">cortesia</Checkbox>
      </CheckboxGroup>

    </Card>

    <Divider />

    <SaleAccordeon filters={filters} selectedUserId={selectedUserId} />

    {isOpen && <NewSaleModal
      isOpen={true}
      handleOpen={handleOpen}
      setIsOpen={setIsOpen}
    />}

  </>
}
